# Getting started

openspec-plus installs into an existing [OpenSpec](https://openspec.dev) project. You need:

- a project where `openspec init` has run (an `openspec/` folder exists),
- the `openspec` CLI on your PATH,
- Node ≥ 18 (the installer has zero dependencies).

This page is the path through your first loop. The reference material lives elsewhere:
[backlog.md](backlog.md), [pillars.md](pillars.md), [commands.md](commands.md).

## Install

openspec-plus is not on npm. Install from the repo:

```bash
# one-shot, once openspec-plus lives in its own repo (package.json declares the bin)
npx github:benstr/openspec-plus all

# or vendor the folder next to your project and run it directly
npx degit benstr/openspec-plus openspec-plus     # (or plain git clone)
node openspec-plus/install.mjs all                # both modules, tools: claude,codex,cursor
node openspec-plus/install.mjs backlog            # just one module
node openspec-plus/install.mjs all --dry-run      # print the plan, write nothing
```

`--target <dir>` picks the project (default: current directory); `--tools claude,codex,cursor`
filters harnesses. Re-run any time — the installer is idempotent and never overwrites a scaffold
file you have edited. The [README](../README.md) lists everything an install writes.

## Invoking the commands, per harness

The same commands install under different names depending on the harness:

| Harness | Invocation | Installed at |
|---|---|---|
| Claude Code | `/opsx:backlog` (colon form) | `.claude/commands/opsx/<id>.md` |
| Cursor | `/opsx-backlog` (hyphen form) | `.cursor/commands/opsx-<id>.md` |
| Codex | `/opsx-backlog` (hyphen form) | `${CODEX_HOME:-~/.codex}/prompts/opsx-<id>.md` |

Tripwires:

- **Codex prompts are GLOBAL.** Like stock OpenSpec, they install to `~/.codex/prompts`, so
  they appear in every project on the machine — including projects where openspec-plus is not
  installed. There the command fails fast looking for `openspec/backlog/README.md`; that is the
  signal, not a bug.
- Docs and command bodies use the colon form (`/opsx:backlog`) throughout — translate to the
  hyphen form in Cursor and Codex.
- Each command also installs as an agent skill (`.claude/skills/openspec-plus-<id>/`, same
  under `.codex/` and `.cursor/`), so a plain-language request can trigger the same flow.

## The first loop

**1. Capture — `/opsx:backlog`.** Paste real context: goals, research notes, a PRD, the
conversation you just had. Not a test item — the command dedups against done/in-flight/planned
work, splits and orders, and it needs real material to do that.

```
/opsx:backlog Here's where the project stands and what we're aiming at: <...>
```

You get ordered rows in `openspec/backlog/backlog.md` plus one **lite** brief per item in
`openspec/backlog/briefs/`. Lite means honestly preliminary — deep planning now would rot
before it's used.

**2. Deepen at pick-up — `/opsx:brief`.** When you're about to work an item (not before):

```
/opsx:brief <item-name>
/opsx:brief <item-name> deep
```

The plain form grounds the brief in your actual codebase — requirements, risks, pointers. Add a
deep-mode keyword — `deep`, `best practices`, or `deep research` — for a web-researched
**Architecture & Ecosystem** section (current patterns, candidate libraries, an opinionated
recommendation). The brief becomes the primary input to the eventual proposal.

**3. Run — `/opsx:next`.** Processes exactly one item end-to-end — brief → propose → apply →
verify → sync → archive — with hard stops for anything ambiguous. Loop it with your harness's
loop driver — `/loop` on a cadence, or `/goal` with an objective:

```
/loop /opsx:next
/goal work the backlog: run /opsx:next repeatedly until it reports LOOP STOP
```

Every invocation ends `LOOP CONTINUE` or `LOOP STOP: <reason>`, so the loop halts itself.
Before you loop, fill in the `## Verification` section of `openspec/backlog/README.md` (e.g.
`npm test`): a missing or empty section makes `/opsx:next` warn and treat verification as
passed — that gate is the one thing only you can supply.

## Where next

- [backlog.md](backlog.md) — ledger discipline, the brief lifecycle, the worklog protocol,
  `/opsx:next` autonomy
- [pillars.md](pillars.md) — the altitude model, DEFINITIONS, delivery depth
- [commands.md](commands.md) — generated per-command reference
- After install, the operational rules live **in your project**: `openspec/backlog/README.md`
  and `openspec/pillars/README.md` govern. These docs only teach.
