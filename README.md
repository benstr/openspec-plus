# openspec-plus

Modular, installable customizations for [OpenSpec](https://openspec.dev) projects.

OpenSpec gives you spec-driven change management (`/opsx:explore → propose → apply → archive`).
openspec-plus adds the layers around it that real projects grow anyway — an **ordered backlog
with working briefs**, and **pillars with a controlled vocabulary** — as opt-in modules that
install into OpenSpec's official customization surfaces and never touch a generated file.

## Modules

### openspec-backlog

An ordered development ledger + per-item working briefs + an autonomous lifecycle runner.

| Command | What it does |
|---|---|
| `/opsx:backlog <context>` | Turns messy context (goals, research, PRDs, a conversation) into deduplicated, ordered backlog items — a **lite brief** per item plus a row in the ledger. Intelligently splits, enriches, and reorders upcoming work; never touches in-flight rows. |
| `/opsx:brief <item> [deep]` | Deepens one item's brief at pick-up time: codebase-grounded requirements, risks, pointers. Add `deep` / `best practices` / `deep research` to trigger a web-research pass producing an opinionated **Architecture & Ecosystem** section (current patterns, candidate libraries, citations). |
| `/opsx:next` | Autonomously processes exactly **one** backlog item end-to-end: brief → propose → apply → verify → sync → archive, with hard stops for anything ambiguous. Ends every run with `LOOP CONTINUE` or `LOOP STOP: <reason>` — designed for `/loop /opsx:next` or a `/goal` objective. |

Core discipline (full rules ship in `openspec/backlog/README.md`):

- **The ledger owns order; OpenSpec owns status.** `openspec/backlog/backlog.md` is the only
  authority for what to build next. `openspec list` = in flight; `openspec/changes/archive/` =
  done. Nothing is ever hand-marked "done".
- **The pointer is the status.** `—` → `briefs/<name>.md` → `openspec/changes/<name>/` →
  *row removed*. No status column to drift.
- **Briefs hand off at propose.** A brief is the primary input to `proposal.md`/`design.md`,
  then moves to `openspec/backlog/archive/` — the change folder becomes the single source of
  truth.
- **Apply harvests.** The capture sweep turns deferred/out-of-scope discoveries back into
  ledger rows and brief notes, so the backlog feeds itself.
- **Serial by default, bounded by policy.** Fresh projects admit one item at a time. A repository
  may commit the strict `owner-scoped-v1` profile to permit one manager to admit at most two
  independently owned implementations; ledger writes, integration, sync, merge, and archive
  remain single-writer.

### openspec-pillars

Guiding principles and a controlled vocabulary that keep agents (and humans) from drifting.

| Command | What it does |
|---|---|
| `/opsx:pillar` | Author or evolve a pillar (timeless belief) in the five-section format. Changes are loud: superseded beliefs are marked, never silently rewritten. |
| `/opsx:definition` | Add or update an entry in `openspec/pillars/DEFINITIONS.md` — the vocabulary resolver (canonical name, aliases, one-sentence meaning, owning mechanism). |

Ships with one preinstalled pillar: **`delivery-depth`** — every change proposal declares
exactly one depth, **`Minimal | Optimized | Production`**, and an adversarial review keeps every
requirement/task inside it (keep / purge / defer). It binds to the proposal's `## Depth` section
via OpenSpec's per-artifact rules, so it works with or without the backlog module; when both
modules are installed, the ledger gains a matching `Depth` column automatically.

## Install

Run it from inside your OpenSpec project — no clone, no global install:

```bash
cd your-project                  # the folder containing your openspec/ directory
npx @benstr/openspec-plus all    # both modules, tools: claude,codex,cursor
```

More options:

```bash
npx @benstr/openspec-plus backlog                              # one module
npx @benstr/openspec-plus pillars --tools claude
npx @benstr/openspec-plus all --dry-run                        # show what would happen
npx @benstr/openspec-plus all --target /path/to/your/project   # install without cd-ing in
```

Requires Node ≥ 18. Zero dependencies. Fully idempotent — re-run any time.

<details>
<summary>Prefer a local clone instead of npx?</summary>

```bash
node openspec-plus/install.mjs all
node openspec-plus/install.mjs pillars --tools claude
node openspec-plus/install.mjs all --dry-run
```
</details>

What an install does:

1. Writes `/opsx:*` command files and agent skills for the selected tools
   (`.claude/commands/opsx/`, `.cursor/commands/`, `~/.codex/prompts/`, plus
   `<tool>/skills/openspec-plus-*/SKILL.md`).
   Codex skills use `.codex/skills` in a fresh repository; when an existing repository already
   uses `.agents/skills` and has no `.codex/skills`, that active convention is preserved instead
   of creating a duplicate tree.
2. Scaffolds `openspec/backlog/` and/or `openspec/pillars/` (existing files are never
   overwritten).
3. Appends a marker-guarded protocol block to `openspec/config.yaml` `context:` (and, for
   pillars, per-artifact `rules:`) — OpenSpec injects these into every artifact instruction at
   runtime, which is how stock `/opsx:propose` and friends learn the protocol without any of
   their files being modified.
4. Maintains a managed block in the root `AGENTS.md` (created if missing) — the single
   progressive-disclosure entry point — and prepends a one-line pointer to an existing root
   regular `CLAUDE.md`/`CODEX.md`. Existing symlinks are preserved without writing through them.
5. Runs cross-module integration hooks (e.g. the ledger `Depth` column) when it detects both
   modules, in either install order.
6. Validates any repository-owned `openspec/backlog/concurrency.json`. Missing policy is the
   normal serial default; malformed or unsupported policy is reported and remains serial after
   universal fail-closed guidance is regenerated.

The backlog scaffold includes `templates/concurrency-profile.schema.json` but does not create a
profile. To opt in, a repository owner commits:

```json
{
  "$schema": "./templates/concurrency-profile.schema.json",
  "schemaVersion": 1,
  "profile": "owner-scoped-v1",
  "implementationWipLimit": 2
}
```

This is only an evaluation ceiling. The installed backlog conventions define serialized
admission, distinct Owner Scope/Engineer, archived dependencies, isolated workspaces, current
capacity evidence, and single-writer shared surfaces.

## Why it survives `openspec update`

OpenSpec regenerates and prunes only its own 12 built-in workflows by exact name. openspec-plus
command ids (`backlog`, `brief`, `next`, `pillar`, `definition`), skill directories
(`openspec-plus-*`), scaffold folders, and `config.yaml` (user-owned by design) are all outside
that set — verified against the OpenSpec source. See [DESIGN.md](DESIGN.md) for the full
architecture contract, including the paths that are deliberately avoided.

## Roadmap

- `uninstall` / `sync` subcommands
- Additional tool targets (mirroring OpenSpec's adapter set)
- More modules — this folder is structured to graduate into a standalone repo
