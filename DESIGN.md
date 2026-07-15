# openspec-plus — Design Contract

This file is the single source of truth for the openspec-plus layout, naming, file formats,
and installer behavior. Every module file and every installer function conforms to it.
(It also serves as the architecture doc when this folder graduates to its own repo.)

## What openspec-plus is

Modular, installable customizations for [OpenSpec](https://openspec.dev) projects. Each module
ships prompt-driven `/opsx:*` commands, project scaffolding under `openspec/`, and wiring through
OpenSpec's *official* customization surfaces only. Stock OpenSpec-generated files are **never
modified** — everything installs into the "safe zone" that `openspec init`/`openspec update`
neither overwrites nor deletes.

Modules (v0.1.0):

| Module | Commands | Scaffold |
|---|---|---|
| `openspec-backlog` | `/opsx:backlog`, `/opsx:brief`, `/opsx:next` | `openspec/backlog/` |
| `openspec-pillars` | `/opsx:pillar`, `/opsx:definition` | `openspec/pillars/` |

## Non-negotiable constraints (verified against OpenSpec internals)

1. **Never write to paths OpenSpec manages.** `openspec update` clobbers/deletes only files
   matching its 12 built-in workflow names. Our command ids (`backlog`, `brief`, `next`,
   `pillar`, `definition`) and skill dirs (`openspec-plus-*` prefix) are outside that set.
2. **Never create `openspec/AGENTS.md`** — OpenSpec's legacy cleanup deletes that exact path.
   Root `AGENTS.md`/`CLAUDE.md` are safe (cleanup only strips `<!-- OPENSPEC:START/END -->`
   marker blocks, and ours differ).
3. **Never scaffold folders inside `openspec/changes/`** — any directory there is treated as a
   change by the CLI.
4. **Avoid legacy-cleanup globs**: no files under `.claude/commands/openspec/`, no
   `.cursor/commands/openspec-*.md`.
5. `openspec/config.yaml` is user-owned (OpenSpec creates it once, never rewrites) — safe for
   marker-guarded edits. Its `context:` is injected into ALL artifact instructions at runtime
   (50KB cap); `rules.<artifactId>` entries are injected per-artifact. This is how the modules
   reach stock `/opsx:propose` etc. without touching their skill files.

## Repo layout

```
openspec-plus/
├── DESIGN.md                  # this file
├── README.md                  # user-facing catalog + install instructions
├── install.mjs                # CLI entry (Node >= 18, zero dependencies)
├── lib/install-core.mjs       # shared helpers + integration-hook registry
└── modules/
    ├── openspec-backlog/
    │   ├── module.json
    │   ├── workflows/{backlog,brief,next}.md
    │   ├── config-snippets/context.md
    │   └── scaffold/backlog/
    │       ├── README.md  ├── AGENTS.md  ├── backlog.md
    │       ├── templates/brief.md
    │       ├── templates/worklog.md
    │       ├── briefs/.gitkeep
    │       └── archive/.gitkeep
    └── openspec-pillars/
        ├── module.json
        ├── workflows/{pillar,definition}.md
        ├── config-snippets/context.md
        ├── config-snippets/rules.json
        └── scaffold/pillars/
            ├── README.md  ├── DEFINITIONS.md  └── delivery-depth.md
```

## module.json schema

```json
{
  "name": "openspec-backlog",
  "version": "0.1.0",
  "description": "Ordered backlog ledger + working briefs + autonomous lifecycle runner",
  "commands": [
    { "id": "backlog", "name": "OPSX+: Backlog", "description": "...", "tags": ["workflow","backlog"], "argumentHint": "free-form context, goals, or research to capture" },
    { "id": "brief",   "name": "OPSX+: Brief",   "description": "...", "tags": ["workflow","backlog","research"], "argumentHint": "<item-name> [deep | best practices | deep research]" },
    { "id": "next",    "name": "OPSX+: Next",    "description": "...", "tags": ["workflow","backlog","autonomous"], "argumentHint": "(no arguments — picks the next eligible item)" }
  ],
  "scaffold": { "source": "scaffold/backlog", "target": "openspec/backlog" },
  "detectFile": "openspec/backlog/backlog.md"
}
```

`detectFile` is how installers and integration hooks test "is this module installed here?"
(pillars: `openspec/pillars/DEFINITIONS.md`).

## Workflow body files (single source)

`modules/<m>/workflows/<id>.md` = YAML frontmatter + markdown body.

```
---
id: backlog
description: <same as module.json>
---
<body>
```

Bodies are written once and wrapped per target by the installer. Conventions inside bodies:

- Reference sibling commands in colon form (`/opsx:brief`); Claude/Codex/Cursor all accept the
  bodies verbatim (stock OpenSpec only hyphen-transforms bodies for opencode/pi/oh-my-pi,
  which we don't target).
- Input line pattern: `**Input**: The argument after \`/opsx:<id>\` is … (when invoked as a
  skill, take the equivalent from the user's request).`
- Bodies that run `openspec` CLI commands (`backlog`, `brief`, `next`) include the stock
  store-selection paragraph (copy the wording from a stock generated command, e.g.
  `src/core/templates/workflows/explore.ts`).
- Conditional-hook pattern for cross-module features: e.g. "If `openspec/pillars/` exists,
  read `DEFINITIONS.md` + `README.md` first …" and "If `openspec/pillars/delivery-depth.md`
  exists, …". Bodies never assume the other module is present.

## Install targets (per project, tools: claude, codex, cursor)

For each command `<id>`:

| Target | Path | Frontmatter |
|---|---|---|
| Claude command | `.claude/commands/opsx/<id>.md` | `name` (`OPSX+: <Title>`), `description`, `allowed-tools: Bash(openspec:*)`, `category: Workflow`, `tags: [..]` |
| Cursor command | `.cursor/commands/opsx-<id>.md` | `name: /opsx-<id>`, `id: opsx-<id>`, `category: Workflow`, `description` |
| Codex prompt | `${CODEX_HOME:-~/.codex}/prompts/opsx-<id>.md` (**global**, like stock OpenSpec) | `description`, `argument-hint: <argumentHint>` |
| Skills (one per command) | `.claude/skills/openspec-plus-<id>/SKILL.md`, `.codex/skills/openspec-plus-<id>/SKILL.md`, `.cursor/skills/openspec-plus-<id>/SKILL.md` | `name: openspec-plus-<id>`, `description`, `allowed-tools: Bash(openspec:*)`, `license: MIT`, `compatibility: Requires the openspec CLI and the openspec-plus <module> module.`, `metadata: {author: openspec-plus, version: "<module version>", generatedBy: "openspec-plus@<version>"}` |

Every generated file starts (after frontmatter) with the line:
`<!-- generated by openspec-plus@<version>; re-run install.mjs to refresh -->`

## installer CLI

```
node openspec-plus/install.mjs <module|all> [--target <dir>] [--tools claude,codex,cursor] [--dry-run]
```

Steps per module (all idempotent; `--dry-run` prints planned actions):
1. Write command/skill files for each selected tool (overwrite our own generated files freely —
   they carry the generatedBy header).
2. Copy scaffold → target (`openspec/backlog/` or `openspec/pillars/`), **never overwriting an
   existing file** (report "kept existing").
3. Marker-edit `openspec/config.yaml` (create the file if absent):
   - append the module's `config-snippets/context.md` lines inside the `context: |` block
     (create the key if absent), wrapped in literal lines
     `>>> openspec-plus:<module> >>>` … `<<< openspec-plus:<module> <<<`
     (these are content inside the YAML block scalar, not YAML syntax);
   - for pillars: merge `config-snippets/rules.json`
     (`{"proposal": ["..."], "specs": ["..."]}`) into `rules:`; every injected rule string is
     prefixed `[openspec-plus:pillars]` (that prefix IS the idempotency marker).
   - Surgery is line-based and conservative: if the file's structure isn't recognized, print
     the exact snippet for manual paste instead of editing. Re-runs replace existing marker
     blocks in place.
4. Regenerate the root `AGENTS.md` managed block between `<!-- openspec-plus:start -->` /
   `<!-- openspec-plus:end -->` (create `AGENTS.md` if missing; never touch content outside the
   markers). Block content is composed from the *detected* installed module set:
   - always: one-paragraph intro ("this repo uses openspec-plus modules") + command table
   - pillars installed: the authority model (read `openspec/pillars/DEFINITIONS.md` first, then
     `openspec/pillars/README.md`; pillars ≻ specs; loud owner-gated pillar changes)
   - backlog installed: the order model (`openspec/backlog/backlog.md` is the ONLY authority
     for development order; the pointer target IS the status; OpenSpec owns status —
     `openspec list` = in flight, `openspec/changes/archive/` = done; never hand-write "done";
     read `openspec/backlog/README.md` before touching the ledger)
5. Prepend a pointer to root `CLAUDE.md` and `CODEX.md` **only if the file already exists** and
   doesn't contain the guard `<!-- openspec-plus:pointer -->`:
   ```
   <!-- openspec-plus:pointer -->
   > Before starting any work, read [AGENTS.md](AGENTS.md) — authority model, planning
   > workflow, and repo vocabulary live there.
   ```
6. Run integration hooks (below).
7. Print a summary: files written / kept / skipped, manual steps if any.

## Integration hooks (pairwise registry in lib/install-core.mjs)

Hook `backlog+pillars` fires when BOTH `detectFile`s exist (whichever module installed last):

- **Ledger Depth column**: in `openspec/backlog/backlog.md`, for every markdown table whose
  header starts `| Item |` and lacks `| Depth |`, insert a `Depth` column after `Item`
  (header, divider, and a blank cell in existing data rows).
- **Brief template**: in `openspec/backlog/templates/brief.md`, add the `**Depth:**` line
  (see template spec) if absent.
- **README cross-notes**: append marker-guarded (`<!-- openspec-plus:depth -->`) paragraphs to
  both scaffold READMEs explaining the depth integration.

## Depth model

Values: **`Minimal | Optimized | Production`**. Primary anchor: every OpenSpec change proposal
declares exactly one depth in a `## Depth` section (enforced by injected `rules.proposal`).
The ledger Depth column is a secondary projection (integration hook). Definitions:

- **Minimal** — prove the capability works truthfully: smallest complete outcome + the evidence
  to show it does what it claims. No speculative tuning, broad failure matrices, or
  future-consumer abstractions. Architecture/trust invariants still apply — Minimal is a scope
  boundary, never a license to cut corners on structure or safety.
- **Optimized** — improve something that already works: measured or reasonably expected
  constraints on the existing path (latency, resource use, common failures, hardening,
  maintainability). Every task states its observed risk/target. No new product outcomes.
- **Production** — prepare a working, reasonably optimized capability for broader use, gated on
  a *named trigger* (new audience, integration, scale class, compliance obligation, GA). Only
  the breadth that trigger demands.

Review discipline (in the pillar): at propose time, adversarially classify every requirement /
design decision / task / test as **within depth**, **required boundary exception**, or **out of
depth**; resolve exceptions via **keep / purge / defer** (defer = deduplicated backlog capture
when the backlog module is present, otherwise record in the proposal's Out of Scope).

## Ledger format (`openspec/backlog/backlog.md`)

- Sections: `## In flight`, `## Upcoming` (wave subsections optional — documented pattern, not
  scaffolded).
- Base columns: `| Item | Depends on | Pointer / state |` (Depth inserted by hook).
- **Item** = kebab-case change name = identity (a future `openspec/changes/<name>/`).
- **Pointer-is-status**: `—` upcoming (no brief) → `briefs/<name>.md` (**lite** or **briefed** /
  **deep**) → `openspec/changes/<name>/` (**proposed**; brief moved to `archive/`) →
  *row removed* when the change is archived.
- Depends on: bare names = hard deps (satisfied when the dep has no row and a matching
  `openspec/changes/archive/*-<dep>/` exists, or was never a change name); `soft:` prefix =
  sequencing preference.
- Row position within a section is development order. The ledger points, never copies.

## Brief lifecycle

1. `/opsx:backlog` creates `openspec/backlog/briefs/<name>.md` from `templates/brief.md`,
   marked `> **Preliminary capture — deepen with /opsx:brief before propose.**`, + ledger row.
2. `/opsx:brief <name>` enriches in place (mutable); deep keywords (`deep`, `best practices`,
   `deep research`) add the **Architecture & Ecosystem** section via a web-research subagent.
3. At propose (stock `/opsx:propose`, guided by injected context, or `/opsx:next`): brief is the
   PRIMARY input for proposal/design; then the brief file MOVES to `openspec/backlog/archive/`
   and the row repoints to `openspec/changes/<name>/`. (Archived-not-deleted; an active copy
   would be stale — the thinking now lives in the change artifacts.)
4. At change archive: the row is removed. Done work lives only in `openspec/changes/archive/`.

## Brief template sections (templates/brief.md)

Title (`# <item-name>`); status blockquote (Preliminary capture / Briefed <date> / Deep-briefed
<date>); `**Depends on:**`; [hook: `**Depth:** Minimal | Optimized | Production — <one-sentence
boundary>`]; `## Objective` (what it delivers, for whom); `## Shape of the approach`;
`## Requirements` (refined, testable statements); `## Open questions & risks`;
`## Pointers` (authority-tagged links: SPEC/CODE/DOC/PRODUCT); optional `## Pillars` (names of
pillars this item leans on — only if pillars module present); deep-mode-only
`## Architecture & Ecosystem (deep research)` (current accepted patterns, candidate libraries
with tradeoffs and citations, an opinionated recommendation). HTML comments guide each section.

## Worklog protocol (compaction resilience)

**Problem.** Long-running loops (especially in ~250k-context harnesses like Codex) compact the
orchestrator mid-change. Everything that lived only in context — the plan, progress inside a big
task, and every subagent's findings — is wiped. The agent then restarts the big task from
scratch, cycling forever without finishing.

**Solution.** `openspec/changes/<name>/worklog.md` — durable, in-change memory, created from
`openspec/backlog/templates/worklog.md` at the propose handoff (or on first apply touch if
absent). It lives inside the change directory so it archives with the change; no cleanup
protocol needed.

Structure:
- `## State` — REWRITTEN in place on every update; hard cap ~30 lines. Fields:
  `Now:` (task in progress) / `Next:` (next concrete action) / `Decisions:` (calls made + why,
  one line each) / `Do NOT redo:` (dead ends — "tried X, failed because Y") /
  `Environment:` (quirks discovered — "tests need Z running").
- `## Entries` — append-only, terse one-liners, chronological.

**The five rules** (embedded in the template itself as comments, in the backlog README, in the
/opsx:next body, and — via the context snippet — in stock apply's runtime instructions, so a
freshly compacted agent meets them on every path):

1. **Read before work.** Every apply session STARTS by reading `## State` and scanning
   `Do NOT redo`. Re-orientation is the default entry path, not a recovery mode — no compaction
   detection needed.
2. **Write ahead.** Update `Now:` BEFORE starting a task; append the entry AFTER finishing it.
   A wipe at any instant leaves a fresh trail.
3. **Subagent digest (CRITICAL).** A subagent's result exists only in orchestrator context. The
   INSTANT a subagent returns, append its digest — finding, file paths, verdict, what NOT to
   redo — BEFORE acting on the result. Never batch digests for later; later may not exist.
4. **Trust the log over instinct.** Before starting any task, check Entries and `Do NOT redo`
   for evidence it already happened; verify on disk (committed code, passing tests, ticked
   boxes), then skip. When the log says done and the disk agrees, it is done.
5. **Record dead ends the moment they fail.** "Tried X — failed because Y" is the single line
   that breaks the endless retry cycle.

**Big-task decomposition rule.** A task too large to finish comfortably inside one context
window is decomposed IN THE WORKLOG: append a `### Plan: <task>` entry with numbered sub-steps
and tick each as it completes. tasks.md keeps the change's granularity; the worklog carries the
finer grain, so progress *within* the task survives compaction.

## Command behavior specs

**/opsx:backlog** — grain 1: messy context → ordered, deduplicated items.
Read `openspec/backlog/README.md` + ledger first. Dedup against three surfaces before creating
anything: `openspec/changes/archive/` (done), `openspec list --json` (in flight), existing rows
(planned). Split the input into right-sized items (each = one coherent future change); derive
kebab-case names; create a lite brief per NEW item; insert rows in dependency-and-value order.
May **split, merge, enrich, and reorder existing Upcoming rows** when new context changes the
picture — but NEVER touches In flight rows, and surfaces contentious calls (possible duplicate,
disputed ordering) to the user with a recommendation instead of acting silently. If pillars
present: resolve vocabulary through DEFINITIONS.md, note candidate pillars per brief; if the
depth pillar is present, assign each row the smallest truthful depth. Output: summary table of
created / enriched / reordered / surfaced.

**/opsx:brief** — grain 2: deepen ONE item at pick-up time. Explore-stance (investigate the
codebase read-only; never write app code). Locate the row + brief (row without brief → create
from template; no row → offer to run `/opsx:backlog` first). Refine requirements, shape, risks,
pointers; converse with the user where they engage — the brief is mutable. Deep mode (keyword
in the argument): spawn a web-research subagent (general-purpose agent with web search; if
unavailable, research inline) to produce the Architecture & Ecosystem section. Update the row's
pointer state (**briefed** / **deep**). If the depth pillar exists: challenge and confirm the
declared depth against what research revealed; a mixed-depth item is split before propose.
May split the item (cheap now — just rows + briefs).

**/opsx:next** — autonomous: exactly ONE item end-to-end per invocation. Composes the sibling
and stock commands; stock command behavior stays authoritative except the listed autonomy
overrides (no selection prompts — the item is explicit; write the brief without offering;
always sync before archive). Steps: (0) if pillars present, read DEFINITIONS + README (+ depth
pillar) first; (1) pick: any In flight row resumes at what its pointer/change state implies;
else topmost Upcoming row whose deps are satisfied; none → `LOOP STOP: <reason>`; (2) pointer
`—` or lite brief → run the `/opsx:brief` flow autonomously; (3) brief → propose flow (brief =
primary input; artifact loop via `openspec status/instructions --json` until `applyRequires`
done; then brief → `archive/`, row → change pointer under `## In flight`, and CREATE
`openspec/changes/<name>/worklog.md` from the template); (4) change → apply flow (READ the
worklog State block first and honor `Do NOT redo`; work tasks.md, tick boxes; follow the five
worklog rules throughout — write ahead, digest every subagent result the instant it returns,
decompose oversized tasks as a worklog `### Plan:`; capture sweep; commit on completion per
stock apply conventions); (5) verification
gate: run the command(s) in the `## Verification` section of `openspec/backlog/README.md` —
missing/empty section = warn + treat as pass; failure = hard stop, never archive; (6) sync flow
then archive flow; remove the ledger row; (7) iteration report ending `LOOP CONTINUE` (item
archived cleanly + another eligible row remains) or `LOOP STOP: <reason>`. Hard stops (report,
never push through): verification failure; unclear task/blocker/design issue in apply;
ledger↔OpenSpec disagreement (OpenSpec wins; fix ledger only if unambiguous); dependency cycle
/ no eligible row; ambiguous capture-sweep finding; depth mismatch (when depth pillar present).
Designed for `/loop /opsx:next` and for `/goal` objectives that repeat `/opsx:next` until it
reports `LOOP STOP`.

**/opsx:pillar** — create or evolve a pillar in `openspec/pillars/`. Guided authoring in the
5-section format (The belief / Why it matters / What it means in practice / What violates it /
Children). Kebab-case slug file; update README's reading-order list; if the README carries a
failure-mode catalog, append new modes (append-only, never renumber). Meaning changes are LOUD:
mark the old belief superseded with a pointer — never silently rewrite; route through an
OpenSpec change when the project uses them.

**/opsx:definition** — add or update a DEFINITIONS.md entry. Entry format: `### Canonical Name`,
`- **Also called:**` (aliases), `- **Meaning:**` (one plain sentence), optional
`- **Not to be confused with:**`, `- **Mechanism:**` (pointer to the owning doc/spec). Nouns
only — rules live in pillars/specs. Alias maintenance: new alias observed in organic use →
append to the entry's synonym set. Supports `*(provisional canonical)*` markers. Never coin an
undefined word — a needed concept gets its entry in the same change.

## Scaffold content specs

- **backlog/README.md**: the conventions doc — everything in "Ledger format" + "Brief
  lifecycle" above, the capture-sweep contract (during apply, harvest deferred/out-of-scope
  discoveries: enrich an existing brief / add a row+lite brief / surface-if-ambiguous; dedup
  first; additive only — never reorder during apply), the optional waves pattern, and a
  `## Verification` section containing only an HTML comment telling the owner to list the
  command(s) `/opsx:next` must pass before archiving (e.g. `npm test`).
- **backlog/AGENTS.md**: agent lens for the folder (read README first; never reorder In
  flight; dedup before minting; preliminary captures stay honestly preliminary; ambiguity →
  surface with a recommendation; the ledger points, never copies).
- **backlog/backlog.md**: short header ("Read README.md before editing. This ledger is the
  only authority for development order; OpenSpec owns status.") + empty In flight / Upcoming
  tables.
- **pillars/README.md**: genericized altitude model — pillars (timeless beliefs) ≻ specs
  (`openspec/specs/`, current truth) ≻ optional project decision records; reading order
  (DEFINITIONS first); the pillar file format; how pillars change (loud, owner-gated,
  supersede-never-silently-edit); the orphan-spec question pattern (a spec citing no pillar =
  missing-pillar question, not a bare failure); the optional failure-mode-catalog pattern; the
  installed-pillar list (starts with `delivery-depth`).
- **pillars/DEFINITIONS.md**: resolver-not-police header (reading permissive via aliases;
  authoring prefers canonical; add-entry-in-same-change; loud meaning changes) + entry format +
  seed entries that document openspec-plus's own vocabulary: `Backlog Ledger`, `Working Brief`,
  `Delivery Depth`, `Pillar` (self-demonstrating).
- **pillars/delivery-depth.md**: the preinstalled pillar per "Depth model" above, structured in
  the 5-section pillar format, with a final **Bindings** section: proposals (always — `## Depth`
  section, injected rules), backlog ledger Depth column (when openspec-backlog is installed),
  verification gates (project-defined). Written to stand alone without the backlog module.

## config snippets

- **backlog context.md** (≤ 15 lines): the backlog protocol digest — ledger is the only order
  authority; pointer-is-status; when proposing a change that has a ledger row, use its brief in
  `openspec/backlog/briefs/<name>.md` as PRIMARY input, then move the brief to
  `openspec/backlog/archive/` and repoint the row to `openspec/changes/<name>/` under
  `## In flight`; during apply run the capture sweep AND maintain the change's `worklog.md`
  (read State first; write ahead; digest subagent results the instant they return) per
  `openspec/backlog/README.md`; rows are removed only when the change archives; never
  hand-write "done".
- **pillars context.md** (≤ 8 lines): read `openspec/pillars/DEFINITIONS.md` (vocabulary) then
  `openspec/pillars/README.md` (reading order) before planning or authoring artifacts; prefer
  canonical terms; a missing concept gets a DEFINITIONS entry in the same change.
- **pillars rules.json**:
  - `proposal`: `[openspec-plus:pillars] Declare exactly one delivery depth (Minimal |
    Optimized | Production) in a "## Depth" section per openspec/pillars/delivery-depth.md,
    state its boundary in one sentence, and keep every requirement/task within it (keep/purge/
    defer anything else).`
  - `specs`: `[openspec-plus:pillars] Cite at least one pillar from openspec/pillars/ that the
    spec enriches; if none fits, surface a missing-pillar question instead of inventing one.`

## Repo packaging (standalone repo)

The openspec-plus folder is a publishable repo:
- `package.json`: name `openspec-plus`, version matches `OPENSPEC_PLUS_VERSION`
  (lib/install-core.mjs), `"type": "module"`, `"bin": {"openspec-plus": "./install.mjs"}`
  (install.mjs carries a `#!/usr/bin/env node` shebang), `"engines": {"node": ">=18"}`,
  `"scripts": {"test": "node --test test/"}`, zero `dependencies` forever.
- `LICENSE`: MIT.
- `.github/workflows/ci.yml`: `node --test test/` on push + PR (Node 20 and 22).
- `test/install.test.mjs`: the zero-dependency smoke suite (node:test). Scenarios: dry-run
  writes nothing; backlog-only install (paths + frontmatter + NO Depth column + config surgery
  preserving pre-existing context/rules + AGENTS.md order-model-only + CLAUDE.md pointer
  prepend); pillars-on-top (rules merge with prefix, AGENTS.md gains authority model, depth
  hook: ledger column + template line + README cross-notes); reverse install order equivalence;
  full-idempotency re-run (zero duplicate blocks/rules/pointers/columns); tool filtering
  (`--tools claude`); config edge cases (plain-scalar `context:`, `rules:` with trailing
  comment, file without trailing newline); CODEX_HOME redirection (never touch the real
  `~/.codex`); prose budgets (backlog context snippet ≤ 15 lines, pillars ≤ 8); scaffold
  invariants (worklog + brief templates exist; base ledger has no Depth column).
  All fixtures under `fs.mkdtempSync(path.join(os.tmpdir(), ...))`; clean up after.
- `docs/`: `getting-started.md` (install → first `/opsx:backlog` → `/opsx:brief` →
  `/opsx:next` loop, per-harness notes for Claude Code / Codex / Cursor);
  `backlog.md` (module deep-dive: ledger discipline, pointer-state lifecycle as a mermaid
  state diagram, briefs, capture sweep, the worklog protocol + compaction story, /loop and
  /goal usage);
  `pillars.md` (altitude model, DEFINITIONS resolver, delivery-depth, authoring flows);
  `commands.md` — GENERATED, never hand-edited: built by `scripts/gen-command-docs.mjs` from
  each module.json + workflow body (command table per module + each body's Input line and
  step headings). The generator is zero-dep and re-run via `npm run docs`.
  Docs teach; scaffolds govern — docs link to scaffold READMEs for the operational rules
  rather than duplicating them.

## Style

Command bodies follow stock OpenSpec voice (imperative steps, `**Steps**` / `**Guardrails**` /
`**Output**` sections, JSON-driven CLI interactions) — read a stock template before writing.
Scaffold docs are plain, principled, and tripwire-dense — no filler.
