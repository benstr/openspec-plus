# DEFINITIONS — the controlled vocabulary

This file is a **resolver, not a police force**. Each entry gives a concept one canonical
name, lists the synonyms organic use has produced (reading is permissive — any listed alias
resolves here), one plain-language sentence of meaning, a "not to be confused with" note
where confusion is live, and a pointer to the document that owns the mechanism. Entries are
**nouns only** — rules live in pillars and specs, never here.

- **Reading**: meet an alias anywhere in the repo → this file resolves it. Source docs are
  never edited just to normalize a synonym.
- **Authoring**: prefer the canonical term (a default, not a blocking rule). Need a concept
  with no entry? **Add the entry in the same change** — never coin an undefined word.
- **Maintenance**: new alias observed in organic use → append it to the entry's synonym set
  in the same change that surfaced it. Meaning changes are owner-gated and loud (see
  `README.md`). Entries marked **(provisional canonical)** carry a contested name: all
  candidates are listed as synonyms until the owner settles the canonical pick.

`/opsx:definition` maintains this file.

---

## Authority and beliefs

### Pillar
- **Also called:** belief, principle — both in organic use
- **Meaning:** a timeless belief document in `openspec/pillars/` recording *why* the
  project is shaped the way it is — the top altitude of the authority model, governing the
  specs beneath it.
- **Not to be confused with:** a spec (`openspec/specs/`), which records current truth
  about behavior and must enrich, never contradict, a pillar.
- **Mechanism:** `openspec/pillars/README.md` (file format, reading order, and how pillars
  change)

### Delivery Depth
- **Also called:** depth, delivery target, the Minimal/Optimized/Production ladder
- **Meaning:** the one scope boundary a change declares — **Minimal**, **Optimized**, or
  **Production** — that every requirement, design decision, task, test, and documentation
  output in the change must be necessary at.
- **Not to be confused with:** a release phase, priority, or quality score — depth bounds
  scope; it never grades the work.
- **Mechanism:** `openspec/pillars/delivery-depth.md`; declared in each change proposal's
  `## Depth` section

## Planning vocabulary

### Backlog Ledger
- **Also called:** the ledger, the backlog
- **Meaning:** the ordered table of planned change items that is the only authority for
  development order — each row an item whose pointer names its current state, never copies
  it.
- **Not to be confused with:** OpenSpec change status — OpenSpec owns status (`openspec
  list` = in flight, `openspec/changes/archive/` = done); the ledger owns order.
- **Mechanism:** `openspec/backlog/backlog.md` (when the openspec-backlog module is
  installed)

### Working Brief
- **Also called:** brief, item brief; a "lite brief" is its preliminary capture form
- **Meaning:** the mutable pre-proposal thinking document for one planned item — objective,
  shape, requirements, risks, pointers — deepened at pick-up time and used as the primary
  input when the item becomes a change proposal.
- **Not to be confused with:** an OpenSpec proposal — the brief feeds the proposal, and is
  archived once the change's artifacts are in place so the live thinking has exactly one home.
- **Mechanism:** `openspec/backlog/briefs/<name>.md` (when the openspec-backlog module is
  installed)
