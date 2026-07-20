#!/usr/bin/env node
/**
 * openspec-plus installer
 *
 * Usage:
 *   npx @benstr/openspec-plus <module|all> [--target <dir>] [--tools claude,codex,cursor] [--dry-run]
 *   node install.mjs <module|all> [...same flags]   # from a clone / vendored copy
 *
 * Installs openspec-plus modules into an OpenSpec project: per-tool command
 * and skill files, project scaffolding under openspec/, marker-guarded
 * openspec/config.yaml wiring, the root AGENTS.md managed block, CLAUDE.md /
 * CODEX.md pointers, and pairwise integration hooks.
 *
 * Zero dependencies. Node >= 18. Behavior is pinned by DESIGN.md.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  codexPromptsDir,
  copyScaffold,
  createWriter,
  isModuleDetected,
  loadModules,
  mergeConfigRules,
  parseWorkflowFile,
  prependPointer,
  regenerateAgentsBlock,
  renderClaudeCommand,
  renderCodexPrompt,
  renderCursorCommand,
  renderSkill,
  runIntegrationHooks,
  upsertConfigContext,
  OPENSPEC_PLUS_VERSION,
  readTextLf,
} from './lib/install-core.mjs';
import { inspectBacklogConcurrencyProfile } from './lib/backlog-concurrency.mjs';

const ALL_TOOLS = ['claude', 'codex', 'cursor'];

/**
 * Where each tool's command file and skill directory live. Codex prompts are
 * global (under CODEX_HOME, honoring the env var); everything else is
 * relative to the target project.
 */
const TOOL_TARGETS = {
  claude: {
    commandPath: (targetDir, id) => path.join(targetDir, '.claude', 'commands', 'opsx', `${id}.md`),
    skillPath: (targetDir, id) =>
      path.join(targetDir, '.claude', 'skills', `openspec-plus-${id}`, 'SKILL.md'),
    renderCommand: renderClaudeCommand,
  },
  codex: {
    commandPath: (_targetDir, id) => path.join(codexPromptsDir(), `opsx-${id}.md`),
    skillPath: (targetDir, id) =>
      path.join(targetDir, '.codex', 'skills', `openspec-plus-${id}`, 'SKILL.md'),
    renderCommand: renderCodexPrompt,
  },
  cursor: {
    commandPath: (targetDir, id) => path.join(targetDir, '.cursor', 'commands', `opsx-${id}.md`),
    skillPath: (targetDir, id) =>
      path.join(targetDir, '.cursor', 'skills', `openspec-plus-${id}`, 'SKILL.md'),
    renderCommand: renderCursorCommand,
  },
};

function usage(modules) {
  const names = modules.length > 0 ? modules.map((m) => m.name).join(' | ') : '(none found)';
  return `openspec-plus installer v${OPENSPEC_PLUS_VERSION}

Usage:
  npx @benstr/openspec-plus <module|all> [options]
  node install.mjs <module|all> [options]     # from a clone / vendored copy

Modules:
  ${names}
  (short names work too, e.g. "backlog" for "openspec-backlog")

Options:
  --target <dir>    project to install into (default: current directory)
  --tools <list>    comma-separated subset of: ${ALL_TOOLS.join(',')} (default: all)
  --dry-run         print planned actions without writing anything
  -h, --help        show this help
`;
}

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const opts = {
    moduleArg: null,
    target: process.cwd(),
    tools: [...ALL_TOOLS],
    dryRun: false,
    help: false,
  };
  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--target') {
      opts.target = argv[++i] ?? fail('--target requires a directory');
    } else if (arg.startsWith('--target=')) {
      opts.target = arg.slice('--target='.length);
    } else if (arg === '--tools') {
      opts.tools = parseTools(argv[++i] ?? fail('--tools requires a comma-separated list'));
    } else if (arg.startsWith('--tools=')) {
      opts.tools = parseTools(arg.slice('--tools='.length));
    } else if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg === '-h' || arg === '--help') {
      opts.help = true;
    } else if (arg.startsWith('-')) {
      fail(`unknown option: ${arg}`);
    } else {
      positionals.push(arg);
    }
  }
  if (positionals.length > 1) fail(`expected one module argument, got: ${positionals.join(' ')}`);
  opts.moduleArg = positionals[0] ?? null;
  return opts;
}

function parseTools(value) {
  const tools = value
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  if (tools.length === 0) fail('--tools requires at least one tool');
  for (const tool of tools) {
    if (!ALL_TOOLS.includes(tool)) {
      fail(`unknown tool "${tool}" — expected a subset of: ${ALL_TOOLS.join(',')}`);
    }
  }
  return [...new Set(tools)];
}

/** Step 1 + 2 + 3 for one module: command/skill files, scaffold, config.yaml. */
function installModule(writer, module, targetDir, tools) {
  console.log(`\nInstalling ${module.name}@${module.version}`);

  // Step 1: command + skill files per selected tool.
  for (const command of module.commands) {
    const workflowPath = path.join(module.dir, 'workflows', `${command.id}.md`);
    if (!fs.existsSync(workflowPath)) {
      fail(`${module.name}: missing workflow body ${workflowPath}`);
    }
    const { body } = parseWorkflowFile(workflowPath);
    for (const tool of tools) {
      const target = TOOL_TARGETS[tool];
      writer.write(target.commandPath(targetDir, command.id), target.renderCommand(command, body), {
        guardGenerated: true,
      });
      writer.write(target.skillPath(targetDir, command.id), renderSkill(module, command, body), {
        guardGenerated: true,
      });
    }
  }

  // Step 2: scaffold copy — never overwrites existing files.
  copyScaffold(
    writer,
    path.join(module.dir, module.scaffold.source),
    path.join(targetDir, module.scaffold.target)
  );

  // Step 3: marker-guarded openspec/config.yaml wiring.
  const configPath = path.join(targetDir, 'openspec', 'config.yaml');
  const contextSnippetPath = path.join(module.dir, 'config-snippets', 'context.md');
  if (fs.existsSync(contextSnippetPath)) {
    upsertConfigContext(writer, configPath, module.name, readTextLf(contextSnippetPath));
  }
  const rulesSnippetPath = path.join(module.dir, 'config-snippets', 'rules.json');
  if (fs.existsSync(rulesSnippetPath)) {
    mergeConfigRules(writer, configPath, JSON.parse(fs.readFileSync(rulesSnippetPath, 'utf8')));
  }
}

function main() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const modules = loadModules(path.join(here, 'modules'));

  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || !opts.moduleArg) {
    console.log(usage(modules));
    process.exit(opts.help ? 0 : 1);
  }
  if (modules.length === 0) {
    fail(`no modules found in ${path.join(here, 'modules')}`);
  }

  const selected =
    opts.moduleArg === 'all'
      ? modules
      : modules.filter((m) => m.name === opts.moduleArg || m.name === `openspec-${opts.moduleArg}`);
  if (selected.length === 0) {
    fail(`unknown module "${opts.moduleArg}" — available: ${modules.map((m) => m.name).join(', ')}, all`);
  }

  const targetDir = path.resolve(opts.target);
  if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
    fail(`target directory not found: ${targetDir}`);
  }

  console.log(
    `openspec-plus v${OPENSPEC_PLUS_VERSION} → ${targetDir}` +
      ` (tools: ${opts.tools.join(', ')})${opts.dryRun ? ' [dry-run]' : ''}`
  );

  const writer = createWriter({ dryRun: opts.dryRun });

  for (const module of selected) {
    installModule(writer, module, targetDir, opts.tools);
  }

  // Detection: detectFile on disk; under --dry-run the scaffold was not
  // actually copied, so modules installed in this run count as detected too.
  const installedNow = new Set(selected.map((m) => m.name));
  const detectedModules = modules.filter(
    (m) => isModuleDetected(m, targetDir) || (opts.dryRun && installedNow.has(m.name))
  );
  const detectedNames = new Set(detectedModules.map((m) => m.name));

  // Validate live repository policy after regenerating universal fail-closed
  // guidance. An invalid profile is diagnostic, never retained authorization.
  if (detectedNames.has('openspec-backlog')) {
    const concurrency = inspectBacklogConcurrencyProfile(targetDir);
    console.log('\nBacklog concurrency profile');
    if (concurrency.status === 'enabled') {
      console.log(
        `  accepted  ${concurrency.filePath} ` +
          `(owner-scoped-v1, implementation WIP limit ${concurrency.implementationWipLimit})`
      );
    } else if (concurrency.status === 'absent') {
      console.log(`  serial    ${concurrency.filePath} (profile absent)`);
    } else {
      writer.manual(
        `Rejected ${concurrency.filePath}; serial admission remains authoritative.`,
        concurrency.diagnostics.join('\n')
      );
    }
  }

  // Step 4: root AGENTS.md managed block, composed from detected modules.
  console.log('\nRoot instruction files');
  regenerateAgentsBlock(writer, targetDir, detectedModules);

  // Step 5: pointer prepend — only if the file already exists.
  prependPointer(writer, path.join(targetDir, 'CLAUDE.md'));
  prependPointer(writer, path.join(targetDir, 'CODEX.md'));

  // Step 6: pairwise integration hooks.
  runIntegrationHooks(writer, targetDir, detectedNames);

  // Step 7: summary.
  writer.printSummary();
}

main();
