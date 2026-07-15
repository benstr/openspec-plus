---
id: pillar
description: Create or evolve a pillar in openspec/pillars/ — guided authoring in the 5-section format, with loud, owner-gated meaning changes
---
Create or evolve a pillar — a timeless belief document in `openspec/pillars/`.

**Input**: The argument after `/opsx:pillar` is the pillar to work on (when invoked as a skill, take the equivalent from the user's request). Could be:
- An existing slug: `delivery-depth` (evolve that pillar)
- A belief to capture: "we never ship silent fallbacks"
- Nothing (list the installed pillars and ask what to do)

---

**Steps**

1. **Read the ground rules first**
   - `openspec/pillars/DEFINITIONS.md` — the controlled vocabulary. Every pillar is written in it.
   - `openspec/pillars/README.md` — the altitude model, reading order, pillar file format, and how pillars change.

2. **Decide: new pillar or evolution**
   - The argument names an existing file in `openspec/pillars/` → evolution. Read the pillar and establish whether the change is **additive** (sharper practice wording, a new failure mode, a new child spec) or a **meaning change** (the belief itself shifts). The distinction drives step 5.
   - Otherwise → candidate new pillar. Before drafting, check the belief isn't already covered: read the reading-order list in the README and skim adjacent pillars. Overlapping pillars weaken all of them — if the idea enriches an existing belief, evolve that pillar instead and say so.

3. **Author in the 5-section format** (guided — draft each section, then refine with the user):
   1. **The belief** — one plain paragraph, first thing in the file. Written for any reader, not just engineers.
   2. **Why it matters** — what breaks about the project's promise without it.
   3. **What it means in practice** — the concrete postures and habits the belief demands.
   4. **What violates it** — named failure modes, concrete enough to recognize in a diff or a doc.
   5. **Children** — the specs that enrich this pillar (list only specs that actually cite it; "None yet" is an honest answer).

   A pillar may close with an optional **Bindings** section when the belief is enforced through specific project surfaces (see `delivery-depth.md` for the pattern).

   Name the file by unnumbered kebab-case slug (e.g. `no-silent-fallbacks.md`). Reading order lives in the README, never in filenames.

4. **Wire it into the README**
   - New pillar: insert it into the installed-pillars reading-order list at the position where it belongs in the reading arc, with the one-line gloss the list uses.
   - Evolution: update the gloss if the belief's one-liner changed.
   - If the README carries a **failure-mode catalog**, append any newly named failure modes with the next available numbers and map each to the pillar(s) it violates. Append-only — never renumber: pillar files cite modes by number.

5. **Meaning changes are LOUD**
   - A meaning change is a supersession, not an edit. Mark the old belief superseded with a pointer to its replacement (a `> **Superseded by …**` note at the top, or a superseded marker in the section) — never silently rewrite or delete what the project once believed.
   - Meaning changes are **owner-gated**: confirm with the owner before changing what a pillar means. Additive maintenance needs no supersession ceremony.
   - If the project manages work through OpenSpec changes, route the meaning change through one (offer to draft the proposal) rather than hand-editing the pillar in place.

6. **Vocabulary check**
   - Every load-bearing term in the pillar must resolve in `DEFINITIONS.md`. A needed concept with no entry gets its entry in the same change — offer to run the `/opsx:definition` flow for each gap. Never coin an undefined word.

---

**Guardrails**

- **Pillars are timeless beliefs** — no implementation details, version numbers, or current-state claims. Current truth belongs in specs; the pillar says *why*.
- **One belief per pillar** — if the draft argues two beliefs, split it.
- **Don't renumber the catalog** — failure modes append with the next number, always.
- **Don't invent children** — the Children section lists specs that actually cite the pillar, not specs you wish existed.
- **Don't silently rewrite meaning** — supersede with a pointer, loudly, owner-gated.

---

**Output**: A short summary — pillar file written (created or evolved), README reading-order and gloss updates, catalog modes appended (with numbers), DEFINITIONS entries added or still needed, and whether a supersession or an OpenSpec change was involved.
