# Backlog conventions

This folder is the planning surface for work that is not yet an OpenSpec change.
`backlog.md` — the Backlog Ledger — is the **single source of truth for what work remains and
in what order**. Nothing else in the project has authority over development order — not a
roadmap doc, not a PRD's "migration path", not any file that says "phases". Those are **scope
input**: read them for *what* a change must do, never for *what order* to do things. If any
document appears to dictate order, it does not; only the ledger does.

Layout (paths without a leading `openspec/` are relative to this folder):

- `backlog.md` — the ledger: ordered rows, the only order authority
- `briefs/<name>.md` — one mutable working brief per upcoming item
- `templates/brief.md` — the brief template
- `templates/worklog.md` — the worklog template (a change's durable, compaction-proof memory)
- `archive/` — briefs whose item has been proposed (superseded by the change's artifacts)
- `AGENTS.md` — the agent lens: tripwires distilled from this doc

The commands: `/opsx:backlog` turns messy context into ordered items, `/opsx:brief` deepens
one item at pick-up time, `/opsx:next` runs the topmost eligible item end-to-end.

## How to read the ledger

- **Completed work is not here.** Finished changes live in `openspec/changes/archive/`. That
  is the record of what's done — the ledger never restates it. When a change is archived, its
  row is *removed*.
- **OpenSpec owns status.** `openspec list` (in flight) and `openspec/changes/archive/` (done)
  are the source of truth for *state*. The ledger owns *order and what's upcoming*. If the two
  ever disagree, OpenSpec wins — fix the ledger. Never hand-write "done" anywhere.
- **The pointer is the status.** Each row's pointer target tells you where the item is in its
  life:
  - `—` → **upcoming** (no brief yet)
  - `briefs/<name>.md` → a working brief exists; the bold label says how deep: **lite**
    (preliminary capture from `/opsx:backlog`), **briefed** (deepened by `/opsx:brief`), or
    **deep** (deep-researched)
  - `openspec/changes/<name>/` → **proposed** (a real OpenSpec change exists; the brief has
    moved to `archive/`)
  - *row removed* → done (see `openspec/changes/archive/`)
- **Identity is the change name.** Item = the kebab-case name of a (future)
  `openspec/changes/<name>/`. Insert or reorder by moving rows — there are no numbers to
  renumber.
- **Row position is development order** within a section (within a wave, if waves are in use —
  see below). The topmost Upcoming row whose dependencies are satisfied is "next".
- **Depends-on conventions:** bare change names are hard dependencies — satisfied when the dep
  has no ledger row and a matching `openspec/changes/archive/*-<dep>/` exists (or the name was
  never a change name). A `soft:` prefix marks a sequencing preference, not a blocker. Event
  triggers live in the pointer text; pull an event-gated row only when its trigger fires.
- **The ledger points; it never copies.** Deep context lives in the item's brief until it is
  proposed, then in the OpenSpec change. A pointer cell carries its target, a bold state
  label, and at most a short parenthetical note — never a restatement of the brief.

## Ledger format

`backlog.md` has two sections with the same column set:

| Item | Depends on | Pointer / state |
|---|---|---|
| `add-rate-limits` | `extract-api-client`, soft: `observability-baseline` | `briefs/add-rate-limits.md` (**lite** — deepen before propose) |

This is the fresh-project minimum, not a global fixed shape. A repository may add governed
columns such as Product Area, Depth, or Concurrency. Every workflow must read the live header,
this README, and `templates/brief.md`, then preserve all declared cells in their existing order.
If `product-areas.md` exists, it is the canonical catalog: put exactly one primary Product Area
in the ledger and brief, keep supporting areas in the brief only, and retain one globally ordered
ledger. If the catalog does not exist, do not invent the taxonomy.

- `## In flight` — rows whose change exists in `openspec list`. When an item is proposed, its
  row moves here. Planning passes never reorder, merge, or split In flight rows; they change
  only as their change advances.
- `## Upcoming` — everything else, in development order. `/opsx:backlog` may split, merge,
  enrich, and reorder these rows when new context changes the picture — surfacing contentious
  calls instead of acting silently.

## Brief lifecycle

A working brief is the mutable thinking home for ONE upcoming item — the opinionated take on
the outcome, shape, requirements, risks, and pointers. One file per item, `briefs/<name>.md`,
created from `templates/brief.md`.

1. **Capture** — `/opsx:backlog` creates a ledger row plus a lite brief per new item, marked
   `> **Preliminary capture — deepen with /opsx:brief before propose.**` Preliminary captures
   stay honestly preliminary: outcome and boundaries only, open questions stated as open
   questions — never dressed up as finished thinking. Each brief records, in `## Intended
   outcome`, the slice of the user's ideal end-state the item advances — its waypoint on the
   path from today (0) to that ideal (1). This is how the end-goal intention survives per-item
   without a central intent file: `/opsx:brief` and propose read it to judge whether the
   declared depth truly serves the end-state, and whether further items at other depths are
   warranted. `## Intended outcome` is deliberately **ephemeral** — a near-term slice that dies
   at propose. A **timeless belief** that should guide future work beyond this batch belongs in
   a pillar, not a brief: with the pillars module installed, capture surfaces such a belief for
   `/opsx:pillar` consideration — but only when it clears the bar (timeless, cross-cutting, not
   already covered). Default is ephemeral; pillars stay rare by design, or they become noise.
2. **Deepen** — `/opsx:brief <name>` enriches the brief in place at pick-up time; the brief is
   mutable and refined through conversation. Deep keywords (`deep`, `best practices`,
   `deep research`) add the **Architecture & Ecosystem** section via web research. The row's
   state label updates to **briefed** or **deep**.
3. **Propose** — when the item becomes an OpenSpec change (stock `/opsx:propose`, or
   `/opsx:next`), the brief is the PRIMARY input for the proposal and design. Then the brief
   file MOVES to `archive/` and the row repoints to `openspec/changes/<name>/` under
   `## In flight`. Archived, not deleted — an active copy would be stale: the thinking now
   lives in the change's artifacts, which supersede the brief entirely. Create the change's
   worklog at this handoff: copy `templates/worklog.md` to
   `openspec/changes/<name>/worklog.md` and seed its `Now:`/`Next:` from the task plan.
4. **Done** — when the change is archived, the row is removed. Done work lives only in
   `openspec/changes/archive/`; this folder never keeps a "done" list.

## Capture sweep (during apply)

Implementation always discovers work it does not build. During apply (stock `/opsx:apply` or
the apply step of `/opsx:next`), before committing, harvest those discoveries.

**Sources:** "out of scope" / "deferred" / "later change" statements in the change's proposal,
design, and specs; caveats recorded in `tasks.md`; deferral comments in code you wrote;
anything you noticed that sharpens an existing upcoming item.

**Dedup first**, against all three surfaces: `openspec/changes/archive/` (done),
`openspec list` (in flight), and existing ledger rows (planned). Then, per discovery:

- **Enriches an existing upcoming item** → append a dated note to its brief in
  `briefs/<name>.md` — what was learned, why it matters, where the evidence is. If the item
  has no brief yet, add a short parenthetical to its ledger row instead.
- **Genuinely new work item** → add a ledger row plus a lite brief from the template, honestly
  marked preliminary, position flagged provisional (e.g. `(**lite** — position flexible)`).
- **Not obvious** — possible duplicate of an existing row, contentious ordering, or the
  discovery might belong in the CURRENT change's scope instead of the backlog → do NOT act
  silently; surface it to the user with a recommendation.

The sweep is **additive only**: never reorder, merge, or delete existing rows during apply —
reordering is planning's job (`/opsx:backlog`). Include everything captured (and everything
surfaced-not-acted-on) in the completion summary, and stage the edits with the change's
commit. Finding nothing to capture is a valid outcome — say so in one line; don't invent
items.

## The worklog (compaction-proof change memory)

Long-running work gets its context window compacted mid-change — and everything that lived
only in context is wiped: the plan, progress inside a big task, and every subagent's findings.
Without a durable trail the next session restarts the big task from scratch and the loop
cycles forever. The worklog is that trail: `openspec/changes/<name>/worklog.md`, created from
`templates/worklog.md` at the propose handoff (or on first apply touch if missing). It lives
inside the change directory, so it archives with the change.

Structure: `## State` is **rewritten in place** (keep it under ~30 lines — `Now` / `Next` /
`Decisions` / `Do NOT redo` / `Environment`); `## Entries` is **append-only**, terse,
chronological.

**The five rules** (they are also embedded in the template itself — a fresh session that opens
the file learns them from the file):

1. **Read first.** Every apply session starts by reading `## State` and scanning `Do NOT
   redo`. Re-orientation is the default entry path — no "did I get compacted?" detection
   needed, because the answer never matters.
2. **Write ahead.** Update `Now:` BEFORE starting a task; append the entry AFTER finishing
   it. A wipe at any instant leaves a fresh trail.
3. **Subagent digest (critical).** The instant a subagent returns, append its digest —
   finding, file paths, verdict, what NOT to redo — BEFORE acting on the result. A subagent's
   insight exists only in orchestrator context until it is written here. Never batch digests
   for later; later may not exist.
4. **Trust the log over instinct.** Before starting any task, check the worklog for evidence
   it already happened; verify on disk (committed code, passing tests, ticked boxes), then
   skip. Do not re-derive what is already recorded.
5. **Record dead ends the moment they fail.** "Tried X — failed because Y" is the single line
   that breaks the endless retry cycle.

**Big-task decomposition:** a task too large to finish in one session is decomposed IN THE
WORKLOG — append a `### Plan: <task>` entry with numbered sub-steps and tick each as it
completes. `tasks.md` keeps the change's granularity; the worklog carries the finer grain, so
progress *inside* the task survives compaction too.

## Concurrency contract

Serial is the universal default. The only supported repository opt-in is a committed
`concurrency.json` that validates against `templates/concurrency-profile.schema.json` with
exactly schema version `1`, profile `owner-scoped-v1`, and implementation Work in Progress limit
`2`. Missing, unreadable, malformed, unknown, stale, differently valued, or extra profile input
means serial. Generated text, a prior install, a Concurrency Class cell, or spare capacity never
grants parallelism.

The valid profile is only a ceiling for evaluation. One Engineering Manager serializes candidate
selection, proposal admission, worklog claim, and ledger commit. Before admitting a candidate,
that manager must prove all conditions:

- fewer than two active implementation claims reconstructed from OpenSpec, ledger pointers,
  worklogs, and Git evidence;
- every hard dependency is archived, not merely proposed or merged;
- the candidate is not `Serialized`, and its primary Owner Scope and accountable Engineer differ
  from every active claim;
- its integration base and governing context are fresh;
- its branch, worktree, worklog, and implementation pull request are isolated;
- no supporting path collides with an active serialized surface; and
- current Engineering Manager, review, CI, merge, recovery, and system-capacity evidence permits
  another lane.

The admitted worklog records item, Owner Scope, Engineer, integration base, profile revision,
capacity observation, isolated execution identity, and serialized surfaces. Commit that claim
transition before implementation starts or another candidate is evaluated. Missing or stale
evidence reduces admission to one or zero lanes; two is a limit, never a utilization target.

Backlog Ledger mutation, admission, definitions/Pillars meaning changes, conflicting current
specs and contracts, migrations/shared schemas, overlapping root config/lockfile/release/generated
instruction changes, integration/merge, current-spec sync, and archive remain single-writer.
`Parallel with serialized integration` work pauses at its named shared surface; `Serialized` work
does not overlap another implementation.

Re-read the live profile and re-evaluate claim, dependency, base/context, surface ownership,
external mutation fencing, and downstream capacity before privileged mutation, review handoff,
integration/merge, sync, and archive. Revoking or invalidating the profile stops new second-lane
admission immediately and reconciles accepted work toward serial operation without deleting its
changes, worklogs, branches, failures, or evidence.

`/opsx:next` always processes exactly one item. Do not race empty-argument invocations; a bulk
objective repeats the one-item cycle unless the serialized Engineering Manager separately admits
independent work under the valid profile. Parallel research and briefing remain allowed, but all
ledger edits are applied sequentially by one writer.

## Waves (optional pattern)

When `## Upcoming` outgrows one readable list, group it into wave subsections. This is a
documented pattern, deliberately not scaffolded:

- Each wave is a `### Wave <n> — <theme>` subsection under `## Upcoming`, carrying the same
  table columns plus an intro line stating its scheduling semantics.
- Waves group by **scheduling semantics** (active spine vs event-gated vs deferred), not by
  topic. Within a wave, row position is development order.
- Across waves, Wave 0 is the active spine — never treat a later-wave row as "next" merely
  because it looks important. Event-gated rows state their trigger in the pointer text and are
  pulled only when that trigger fires.

## Verification

<!-- Owner: list the command(s) `/opsx:next` must run and pass before archiving a change —
     one per line, e.g. `npm test`. A missing or empty section makes `/opsx:next` warn and
     treat verification as passed; a listed command that fails is a hard stop — a change is
     never archived over a red verification. -->
