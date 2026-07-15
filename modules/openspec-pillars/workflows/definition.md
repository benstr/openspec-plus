---
id: definition
description: Add or update an entry in openspec/pillars/DEFINITIONS.md — the controlled vocabulary resolver (nouns only; never coin an undefined word)
---
Add or update an entry in `openspec/pillars/DEFINITIONS.md` — the controlled vocabulary the rest of the repo is written in.

**Input**: The argument after `/opsx:definition` is the term to define or maintain (when invoked as a skill, take the equivalent from the user's request). Could be:
- A new concept that needs a name: "the capture sweep we do during apply"
- An alias observation: "people keep calling the ledger 'the queue'"
- A pointer update: "Working Brief's mechanism doc moved"
- Nothing (review DEFINITIONS.md with the user for gaps and stale entries)

---

**Steps**

1. **Read the DEFINITIONS.md header first** — it defines how the file works (a resolver, not a police force: reading is permissive via aliases; authoring prefers canonical; meaning changes are loud).

2. **Locate or create the entry**
   - Search existing entries AND their `Also called:` synonym sets before creating anything — the concept may already live under another name. A duplicate entry is worse than a missing one; if the term is really an alias of an existing concept, this is an alias append, not a new entry.
   - New entries go in the section of the file where they belong topically, under a `### Canonical Name` heading.

3. **Write the entry in the exact format**:

   ```markdown
   ### Canonical Name
   - **Also called:** alias one, alias two — synonyms organic use has produced
   - **Meaning:** one plain-language sentence saying what the thing is.
   - **Not to be confused with:** (optional — only where confusion is live)
   - **Mechanism:** pointer to the doc/spec that owns the mechanism
   ```

   - **Meaning** is one sentence, plain language, sayable to any reader.
   - **Mechanism** points, never copies — name where the mechanism lives, don't restate it.

4. **Pick the right maintenance move** and apply it:
   - **New alias observed in organic use** → append it to the entry's synonym set. Never edit source docs just to normalize a synonym — reading stays permissive.
   - **Contested canonical name** → keep the entry, mark the heading `*(provisional canonical)*`, list every candidate as an alias; the owner settles the pick later.
   - **Pointer drift** → fix the Mechanism pointer to the doc that owns the mechanism now.
   - **Meaning change** → loud and owner-gated (see `openspec/pillars/README.md`): confirm with the owner, and mark the old meaning superseded with a pointer to its replacement — never silently rewrite.

---

**Guardrails**

- **Nouns only** — rules live in pillars and specs, never here. If the "definition" is really a rule, offer `/opsx:pillar` or a spec instead.
- **One sentence of meaning** — if it takes a paragraph, the Mechanism pointer is carrying too little weight.
- **Never coin an undefined word** — a change that introduces a new concept lands its entry in the same change.
- **Dedup before minting** — check canonical names and aliases both.
- **Don't normalize source docs** — aliases resolve here; prose elsewhere stays as written.

---

**Output**: The entry as written (or updated), plus which move it was — new entry, alias append, pointer fix, provisional marker, or supersession — and anything owner-gated that still needs the owner's confirmation.
