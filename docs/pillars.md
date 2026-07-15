# The pillars module

`openspec-pillars` adds the altitude above specs: **pillars** (timeless beliefs that say *why*
the project is shaped the way it is) and **DEFINITIONS.md** (the controlled vocabulary
everything else is written in). Two commands: `/opsx:pillar` (author or evolve a belief) and
`/opsx:definition` (maintain the vocabulary). One pillar ships preinstalled: `delivery-depth`.

This page teaches the model. The operational rules **govern from inside your project** at
`openspec/pillars/README.md` ([scaffold source](../modules/openspec-pillars/scaffold/pillars/README.md))
and the header of `openspec/pillars/DEFINITIONS.md`
([scaffold source](../modules/openspec-pillars/scaffold/pillars/DEFINITIONS.md)). If this page
and those files disagree, those files win.

## The altitude model

1. **Pillars** (`openspec/pillars/`) — timeless beliefs: *why*.
2. **Specs** (`openspec/specs/`) — current truth: *what/how* the system behaves today.
3. **Decision records** (optional, project-defined) — scoped intentional compromises, each
   with a concrete revisit trigger.

Higher altitude governs lower. Specs enrich pillars and never contradict them; a conflict
between altitudes is an **altitude violation**, fixed through an OpenSpec change — never by
quietly rewording either side. Reading order is fixed: DEFINITIONS first, then the pillars in
the README's listed order, then the specs.

Two patterns keep the model honest as it grows:

- **Orphan specs.** Every spec should cite at least one pillar as its parent (the installer
  injects a `rules.specs` reminder into `openspec/config.yaml`). A spec citing no pillar is a
  *missing-pillar question* to surface — either the pillar set is incomplete or the spec
  doesn't belong. Never a bare failure, and never a reason to invent a citation.
- **Failure-mode catalog** (optional). The README can carry a numbered catalog of every named
  way a careless developer or model plausibly breaks the project, each mode mapped to the
  pillar(s) it violates. Append-only — pillar files cite modes by number, so renumbering is
  forbidden.

## DEFINITIONS.md: a resolver, not a police force

The wrong mental model is a style guide that flags every non-canonical word. The right one is
a resolver: any term you meet anywhere in the repo resolves *here* to exactly one concept.

- **Reading is permissive.** Every entry lists the synonyms organic use has produced; meet an
  alias in any doc and this file resolves it. Source docs are never edited just to normalize a
  synonym.
- **Authoring prefers canonical.** A default, not a blocking rule.
- **Alias maintenance is append-only.** A new alias observed in organic use gets appended to
  the entry's synonym set in the same change that surfaced it. A contested canonical name is
  marked `*(provisional canonical)*` with every candidate listed as an alias, until the owner
  settles the pick.
- **Never coin an undefined word.** A change that introduces a new concept lands its
  DEFINITIONS entry in the same change — that is the whole enforcement mechanism, and it is
  enough.
- **Nouns only.** Rules live in pillars and specs, never here. If a "definition" is really a
  rule, it wants `/opsx:pillar` or a spec.

Each entry: `### Canonical Name`, `**Also called:**` (the synonym set), `**Meaning:**` (one
plain sentence), optional `**Not to be confused with:**`, and `**Mechanism:**` — a pointer to
the doc that owns the mechanism. The Meaning sentence stays short *because* the Mechanism
pointer carries the weight: point, don't copy.

Meaning changes — unlike alias appends — are loud and owner-gated, same as pillars:
superseded with a pointer, never silently rewritten.

## The delivery-depth pillar

Preinstalled at `openspec/pillars/delivery-depth.md`
([scaffold source](../modules/openspec-pillars/scaffold/pillars/delivery-depth.md)). The
belief: delivery depth matches the objective — architecture and trust invariants are the floor
at every depth; only the depth of operational proof changes.

Every change declares exactly one depth:

- **Minimal** — prove the capability works truthfully: the smallest complete outcome plus the
  evidence that it does what it claims. No speculative tuning, broad failure matrices, or
  future-consumer abstractions. Minimal is a scope boundary, never a license to cut corners on
  structure or safety.
- **Optimized** — improve something that already works: measured or reasonably expected
  constraints on the existing path (latency, resource use, common failures, hardening,
  maintainability). Every task states its observed risk or target. No new product outcomes.
- **Production** — prepare a working, reasonably optimized capability for broader use, gated
  on a *named trigger* (new audience, integration, scale class, compliance obligation, GA).
  Only the breadth that trigger demands.

**The anchor is the proposal.** Every OpenSpec change proposal carries a `## Depth` section
declaring exactly one depth plus its boundary in one sentence — enforced by the
`rules.proposal` entry the installer injects into `openspec/config.yaml`, which OpenSpec feeds
into stock `/opsx:propose` at runtime. No stock file is modified to make this happen.

**Review discipline.** At propose time, adversarially classify every requirement, design
decision, task, and test as **within depth**, a **required boundary exception**, or **out of
depth**. Each exception gets exactly one disposition:

- **Keep** — only when omitting it would make the declared outcome false, unsafe, structurally
  non-conformant, or impossible to verify. Recorded in the design, tasks kept as narrow as the
  rationale.
- **Purge** — unnecessary at the declared depth: remove it rather than leave dormant
  complexity.
- **Defer** — valid work at another depth: deduplicate, then capture it as a backlog item with
  the proper depth when the backlog module is installed, otherwise in the proposal's Out of
  Scope. The current change must not implement it.

Implementation discoveries use the same three-way call; crossing a depth boundary mid-change
is a planning event — stop, adjudicate, update the artifacts, then continue.

**Ledger projection.** When `openspec-backlog` is also installed (in either order), an
integration hook adds a `Depth` column to the ledger and a `**Depth:**` line to the brief
template. The column is a *projection* of the depth the item's proposal will declare — assign
the smallest truthful depth at capture; `/opsx:brief` challenges it against what investigation
revealed, and a mixed-depth item is split before propose. `/opsx:next` treats a depth mismatch
as a hard stop.

## /opsx:pillar — authoring beliefs

Guided authoring in the 5-section format, in this order:

1. **The belief** — one plain paragraph, first thing in the file, written for any reader.
2. **Why it matters** — what breaks about the project's promise without it.
3. **What it means in practice** — the concrete postures and habits it demands.
4. **What violates it** — named failure modes, concrete enough to recognize in a diff.
5. **Children** — the specs that actually cite it ("None yet" is an honest answer).

An optional closing **Bindings** section names the project surfaces that enforce the belief
(see `delivery-depth.md` for the pattern). Files are named by unnumbered kebab-case slug;
reading order lives in the README's list, never in filenames — `/opsx:pillar` maintains that
list, and appends (never renumbers) the failure-mode catalog when the README carries one.

The tripwires:

- **One belief per pillar** — a draft arguing two beliefs splits.
- **Timeless** — no implementation details, version numbers, or current-state claims; current
  truth belongs in specs.
- **Meaning changes are LOUD and owner-gated.** A meaning change is a supersession, not an
  edit: the old belief is marked superseded with a pointer to its replacement — never silently
  rewritten or deleted — and it routes through an OpenSpec change when the project uses them.
  Additive maintenance (a sharper practice line, a new failure mode, a new child) needs no
  ceremony.
- Every load-bearing term must resolve in DEFINITIONS.md — gaps get entries in the same
  change.

## /opsx:definition — maintaining the vocabulary

Adds or updates one DEFINITIONS entry, always deduplicating against canonical names AND
synonym sets first — a duplicate entry is worse than a missing one. Four maintenance moves,
matched to what actually happened:

| Observation | Move |
|---|---|
| New alias in organic use | Append it to the entry's synonym set (never edit source docs) |
| Contested canonical name | Mark `*(provisional canonical)*`, list all candidates as aliases |
| Mechanism doc moved | Fix the pointer |
| The meaning itself changed | Loud, owner-gated supersession with a pointer |

Nouns only; one sentence of meaning; if the sentence wants to become a paragraph, the
Mechanism pointer is carrying too little weight.
