# Pillars — the belief altitude

This folder is the top of the repo's authority model:

1. **Pillars** (here) — timeless beliefs: *why* the project is shaped the way it is.
2. **Specs** (`openspec/specs/`) — current truth: *what/how* the system behaves today.
3. **Decision records** (optional, project-defined location) — scoped intentional
   compromises: where the current version deliberately falls short of a pillar or spec,
   with a concrete revisit trigger.

Higher altitude governs lower. Specs enrich pillars and never contradict them; a conflict
between altitudes is an **altitude violation**, fixed through an OpenSpec change — never by
quietly rewording either side.

## Reading order

1. **`DEFINITIONS.md` first** — the controlled vocabulary every other document in this repo
   is written in. Read it before consuming or authoring pillars, specs, or changes.
2. Then the pillar files in this folder, in the order listed below.
3. Then the specs.

## What's in this folder

- `DEFINITIONS.md` — the vocabulary resolver (see its own header for how entries work).
- One file per pillar, named by unnumbered kebab-case slug (e.g. `delivery-depth.md`).
  Reading order across pillars lives here in this README, not in filenames.

The installed pillars, in reading order:

1. `delivery-depth` — Minimal, then Optimized, then Production; the depth of operational
   proof scales with the objective, architecture and trust invariants do not

`/opsx:pillar` maintains this list — new pillars are inserted where they belong in the
reading arc, with a one-line gloss.

## Pillar file format

Every pillar file follows this shape, in this order:

1. **The belief** — one plain paragraph, first thing in the file. Written for any reader,
   not just engineers.
2. **Why it matters** — what breaks about the project's promise without it.
3. **What it means in practice** — the concrete postures and habits the belief demands.
4. **What violates it** — named failure modes, concrete enough to recognize in a diff or
   a doc.
5. **Children** — the specs that enrich this pillar.

A pillar may close with an optional **Bindings** section when the belief is enforced
through specific project surfaces (see `delivery-depth.md`).

## How pillars change

Pillars and DEFINITIONS entries mutate **loudly and owner-gated**: meaning changes only
through an owner-approved change, and a superseded belief or definition is marked
superseded with a pointer to its replacement — never silently edited or deleted. Additive
maintenance (a new pillar, a new synonym, a new failure mode, a new child spec) still
travels through a change but needs no supersession ceremony.

## Orphan specs

Every spec should cite at least one pillar as its parent. A spec citing no pillar is an
**orphan-spec finding**: either the pillar set is incomplete or the spec doesn't belong.
Treat it as a missing-pillar *question* to surface, never a bare failure to paper over —
and never invent a pillar citation just to satisfy the rule. A change authoring a new spec
lands the pillar citation (or, owner-gated, the new pillar it needs) in the same change —
the same pattern DEFINITIONS entries use.

## Failure-mode catalog (optional pattern)

As the pillar set grows, this README can carry a numbered catalog: every named way a
careless developer or model plausibly breaks this project, each mode mapped to the
pillar(s) it violates. Two rules make the catalog work:

- **Standing test** — a failure mode anyone can name that maps to no pillar means the
  pillar set is incomplete.
- **Append-only** — new modes take the next number; renumbering is forbidden, because
  pillar files cite modes by number.

Start the catalog once there are enough pillars for the mapping to bite. If present,
`/opsx:pillar` appends new modes to it whenever a pillar names a failure mode the catalog
lacks.
