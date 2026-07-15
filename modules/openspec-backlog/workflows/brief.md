---
id: brief
description: Deepen one backlog item's working brief at pick-up time - codebase-grounded requirements, risks, pointers; deep mode adds web research
---
Deepen ONE backlog item's working brief at pick-up time.

**This is grain 2: the item is about to be worked, so the investigation now pays.** Ground the brief in the actual codebase, refine the requirements, surface risks, and leave pointers — the brief becomes the PRIMARY input to the eventual proposal and design.

**IMPORTANT: This is an explore-stance command — investigate, don't implement.** Read files, search code, run read-only commands, but never write application code. Writing the brief and updating the ledger IS the deliverable.

**Store selection:** If the user names a store (a store is a standalone OpenSpec repo registered on this machine) or the work lives in one, run `openspec store list --json` to discover registered store ids, then pass `--store <id>` on the commands that read or write specs and changes (`new change`, `status`, `instructions`, `list`, `show`, `validate`, `archive`, `doctor`, `context`). Other commands do not take the flag. Hints printed by commands already carry the flag; keep it on follow-ups. Without a store, commands act on the nearest local `openspec/` root.

**Input**: The argument after `/opsx:brief` is the item name (a kebab-case ledger row), optionally followed by a deep-mode keyword — `deep`, `best practices`, or `deep research` (when invoked as a skill, take the equivalent from the user's request).

**Steps**

1. **Read the conventions, then locate the item**

   Read `openspec/backlog/README.md`, then find the item's row in `openspec/backlog/backlog.md` and its brief at `openspec/backlog/briefs/<name>.md`.

   - Row + brief exist → enrich the brief in place. It is mutable — that's the point.
   - Row exists, pointer is `—` (no brief) → create the brief from `openspec/backlog/templates/brief.md` first, then deepen it.
   - No row → the item isn't planned. Offer to run `/opsx:backlog` first so it gets deduplicated and ordered properly — don't mint an ad-hoc row here.

   If `openspec/pillars/` exists, read `openspec/pillars/DEFINITIONS.md` and `openspec/pillars/README.md` before authoring: resolve vocabulary through DEFINITIONS.md, resolve conflicting sources through the authority order in the pillars README, and name the pillars the item leans on in the brief's `## Pillars` section (no pillar fits → record a missing-pillar question, don't invent one).

2. **Check OpenSpec state**

   ```bash
   openspec list --json
   ```

   If a change named `<name>` already exists, check `openspec status --change "<name>" --json`:
   - Every `applyRequires` artifact `done` → the brief phase is over; the change artifacts own the thinking now. Report the ledger↔OpenSpec state (OpenSpec wins) and stop instead of writing a brief that would be stale on arrival.
   - Propose incomplete (some `applyRequires` artifact not `done`) → the still-active brief remains the PRIMARY input for finishing the artifacts. Report the state and direct to completing the propose flow (`/opsx:propose <name>`) rather than deepening the brief further.

3. **Investigate the codebase (read-only)**

   Ground the brief in reality: map the architecture the item touches, find integration points, identify patterns already in use, surface hidden complexity. Read the sources the lite brief points at. Don't just theorize.

4. **Refine the brief in place**

   Work through the template's sections:
   - `## Objective` — what it delivers, for whom
   - `## Shape of the approach` — the emerging how, with alternatives considered
   - `## Requirements` — refined, testable statements
   - `## Open questions & risks` — honestly open; what could sink or reshape this
   - `## Pointers` — authority-tagged links (SPEC/CODE/DOC/PRODUCT) into the sources that matter

   Converse with the user wherever they engage — this is a dialogue, not form-filling. Capture their calls; keep genuinely open questions open. Update the status blockquote to `> **Briefed <date>.**` (today's date).

5. **Deep mode (only when the argument carries a deep keyword)**

   Spawn a web-research subagent (a general-purpose agent with web search; if no subagent is available, research inline) to produce the `## Architecture & Ecosystem (deep research)` section:
   - current accepted patterns for this problem class
   - candidate libraries/approaches with tradeoffs and citations
   - an opinionated recommendation

   Fold the findings back into Requirements and Shape where they change the picture. Status blockquote becomes `> **Deep-briefed <date>.**`.

6. **Challenge the depth** (only if `openspec/pillars/delivery-depth.md` exists)

   Test the brief's declared `**Depth:**` (`Minimal | Optimized | Production`) against what investigation revealed. Confirm it or change it with the user — never silently. A mixed-depth item must be split before propose: the out-of-depth work moves to its own deduplicated row + lite brief.

7. **Split if the shape demands it**

   Splitting is cheap now — just rows and briefs, nothing committed. If investigation shows the item is really two coherent changes, split it: dedup the new name against all three surfaces (`openspec/changes/archive/`, `openspec list --json`, existing rows), then add the row + lite brief and adjust dependencies.

8. **Update the row's pointer state**

   In `openspec/backlog/backlog.md`, point the row at `briefs/<name>.md` (**briefed**) — or (**deep**) after deep mode. The pointer target is the status; touch nothing else on the row unless a split changed dependencies or the depth challenge (step 6) changed the declared depth — then update the row's Depth cell to match the brief.

**Output**

Summarize:
- Item and resulting state: **briefed** or **deep**
- What changed in the brief (requirements refined, risks added, depth confirmed/changed)
- Any split performed or surfaced-for-input
- Remaining open questions the proposal will have to answer
- Prompt: "When you're ready, `/opsx:propose <name>` — the brief is the primary input."

**Guardrails**
- Never write application code — investigation is read-only; the brief is the only deliverable
- One item per invocation — depth of attention is the point of grain 2
- The brief is mutable — enrich in place; never fork copies of it
- Don't fake certainty: an unresolved question recorded as open is a good brief, not a bad one
- Ledger edits are limited to this item's row (pointer state, split-adjusted deps) — never reorder others
- If ledger and OpenSpec disagree, OpenSpec wins — report it; fix the ledger only if the fix is unambiguous
