---
id: backlog
description: Turn messy context into ordered, deduplicated backlog items - a ledger row plus lite working brief per item
---
Capture backlog work. Turn messy context — goals, research, PRDs, audit findings, a conversation — into ordered, deduplicated items in the backlog ledger.

**This is grain 1: right-size and order, don't deep-plan.** Each new item gets a **lite working brief** (an honest preliminary capture) plus a row in `openspec/backlog/backlog.md`. Deep planning happens later, at pick-up time, via `/opsx:brief` — a deep brief written now would rot before it's used. But right-sizing starts by reading the context for the user's **ideal end-state** and sketching a light path from where the project is now (**0**) to that ideal (**1**): the items you mint are waypoints along that path, at whatever mix of depths the path honestly needs — not a flat pile of smallest-possible tasks. Reading that end-state is part of grain 1; the deep per-item investigation still waits for `/opsx:brief`.

**Store selection:** If the user names a store (a store is a standalone OpenSpec repo registered on this machine) or the work lives in one, run `openspec store list --json` to discover registered store ids, then pass `--store <id>` on the commands that read or write specs and changes (`new change`, `status`, `instructions`, `list`, `show`, `validate`, `archive`, `doctor`, `context`). Other commands do not take the flag. Hints printed by commands already carry the flag; keep it on follow-ups. Without a store, commands act on the nearest local `openspec/` root.

**Input**: The argument after `/opsx:backlog` is free-form context to capture — goals, research notes, a PRD, audit findings — or nothing, in which case work from what the conversation surfaced (when invoked as a skill, take the equivalent from the user's request).

**Steps**

1. **Read the conventions and the ledger first**

   Read `openspec/backlog/README.md` (the rules) and `openspec/backlog/backlog.md` (the ledger) before touching either. The ledger is the ONLY authority for development order; OpenSpec owns status. The pointer column IS each row's status — there is no status field to edit.

   If `openspec/pillars/` exists, read `openspec/pillars/DEFINITIONS.md` and `openspec/pillars/README.md` first: resolve vocabulary through DEFINITIONS.md, prefer canonical terms, and never coin an undefined word.

2. **Extract the ideal end-state, then run a light research pass**

   Before splitting, read the context for the user's **true end-goal** — the ideal state (**1**), not just the immediate ask. Separate it explicitly from the **current state (0)**, and note any signal that the user wants a deep, best-practice, or performant outcome — those signals are legitimate depth evidence downstream, not noise to flatten away.

   Then run a **light, bounded, read-only research pass** to inform the 0→1 map and the depth calls: skim the codebase for the current state, and — only when the context points at external best-practice or performance targets — do a *few* read-only doc/web lookups. This is planning reconnaissance, not `/opsx:brief deep`: a handful of lookups to shape the map, never a per-item deep dive, and never any code or proposal.

   The result is a **preliminary 0→1 map** — the ordered set of coherent changes that carry the project from current to ideal state. Keep it in working memory only; it is **never persisted as a central file** (the ledger owns order; each item's slice of the end-state lands in its brief's `## Intended outcome`). Expect the map to imply items at a **mix of depths** — an early Minimal capability, then Optimized/Production waypoints.

   **Separate the ephemeral from the durable — and keep the pillar bar high** (only when `openspec/pillars/` exists). Almost all of an end-state is a **near-term slice**: it belongs in `## Intended outcome` and rightly dies at propose. Only rarely does the intent also express a **timeless belief** that should govern *future* work beyond this batch — and that belongs in a pillar, not a brief. Surface such a belief for `/opsx:pillar` consideration **only when it clears every bar**:
   - **Timeless** — still true across many future changes; not tied to this feature, version, or a specific technology choice.
   - **Cross-cutting** — governs multiple future items, not just one (a belief that shapes a single item is just that item's shape).
   - **Not already covered** — check existing pillars first; if it merely *enriches* an existing pillar, recommend evolving that one, never minting a new belief (overlapping pillars weaken all of them).

   Default to ephemeral: when in doubt, leave it in `## Intended outcome` and say nothing. A missed pillar costs nothing — it can be raised any time later — but a low-bar pillar devalues every pillar and turns the set into noise. Surface a cleared candidate as a *recommendation* and let the user decide; never author or evolve a pillar here (that is `/opsx:pillar`, owner-gated and loud). Zero pillar candidates is the normal, healthy outcome.

3. **Dedup against all three surfaces**

   Before creating anything, check every candidate item against:
   - `openspec/changes/archive/` — already done
   - `openspec list --json` — in flight
   - existing ledger rows — already planned

   Never re-plan finished or in-flight work. Context that sharpens an existing Upcoming item belongs in that item's brief (append a dated note), not in a new row.

4. **Split the 0→1 path into right-sized items**

   Each item = one coherent future change. Split the **path** from step 2, not just the raw input — it naturally yields **multiple items at varying scope and depth** (an early Minimal capability, then Optimized/Production waypoints as the end-state demands); do not collapse the path to a single smallest-possible first item. Derive a kebab-case name per item (e.g., "let users export their reports" → `report-export`) — the name is the item's identity and its future `openspec/changes/<name>/` directory. Too big (multiple independent outcomes) → split. Fragments of one outcome → merge.

5. **Create a lite brief per NEW item**

   Copy `openspec/backlog/templates/brief.md` to `openspec/backlog/briefs/<name>.md` and fill in only what the input honestly supports, marked:

   > **Preliminary capture — deepen with /opsx:brief before propose.**

   Fill the brief's `## Intended outcome` with **this item's slice of the ideal end-state** — where it sits on the 0→1 path and what the end-state it builds toward looks like. This is how the user's true intent survives per-item without a central file; `/opsx:brief` and propose read it later to judge depth and decide whether further items are warranted.

   State open questions as open questions. A thin honest brief beats a padded one.

   If `openspec/pillars/` exists, note candidate pillars the item leans on in the brief's `## Pillars` section; if no pillar fits, record that as a missing-pillar question rather than inventing one.

6. **Insert rows in dependency-and-value order**

   Add one row per new item under `## Upcoming` in `openspec/backlog/backlog.md`:

   ```
   | <name> | <deps> | briefs/<name>.md (**lite**) |
   ```

   Row position within a section is development order — place each row where its dependencies allow and its value dictates. Bare names in `Depends on` are hard deps; prefix `soft:` for sequencing preferences. If the ledger groups Upcoming into wave subsections (an optional pattern the README documents), insert within the appropriate wave.

   If `openspec/pillars/delivery-depth.md` exists, assign each row the smallest depth (`Minimal | Optimized | Production`) that truthfully serves the item's objective **on the path to its recorded `## Intended outcome`** — never the item weighed in isolation. The recorded end-state is a legitimate source of the evidence Optimized needs or the trigger Production names, so a higher-depth waypoint is *justified, not padding*; depth still stays the smallest truthful one for that objective-on-the-path, and the architecture/trust floor is unchanged. Record it in the ledger's `Depth` column and the brief's `**Depth:**` line with a one-sentence boundary. Across the items minted from one 0→1 map, expect a **mix** of depths — a batch where every fresh item is Minimal is a signal the end-state was dropped; re-check the intent before finishing.

7. **Revise existing Upcoming rows where new context changes the picture**

   You may split, merge, enrich, and reorder existing **Upcoming** rows when the new context genuinely changes the shape of planned work — including **raising an item's depth** or adding a higher-depth waypoint when the sharpened end-state calls for it. NEVER touch `## In flight` rows. When a call is contentious — a possible duplicate, a disputed ordering, a depth change, scope that might belong to an in-flight change — do not act silently: surface it to the user with your recommendation and wait.

**Output**

Summarize every action taken (and not taken):

```
## Backlog updated

| Action | Item | Notes |
|---|---|---|
| created | <name> | lite brief + row, after <dep> |
| enriched | <name> | dated note appended to brief |
| reordered | <name> | moved above <other> (dependency) |
| surfaced | <name> | possible duplicate of <other> — recommend merge; awaiting input |
| pillar-candidate | <belief> | durable belief in the intent — recommend `/opsx:pillar` (new) or evolving `<pillar>`; awaiting input |
```

Finding nothing new to capture is a valid outcome — say so in one line, don't invent items. Surfacing **zero** pillar candidates is likewise the common, healthy case — pillars are rare by design.

**Guardrails**
- Read `openspec/backlog/README.md` before every ledger edit — the conventions are strict
- Dedup before minting: archive, `openspec list --json`, existing rows — always all three
- The ledger points, never copies — context lives in briefs; rows stay one line
- Never touch In flight rows; never hand-write "done" — OpenSpec owns status
- Preliminary captures stay honestly preliminary — open questions stay open, not guessed shut
- Every new item records its slice of the end-state in the brief's `## Intended outcome` — intent is captured per-item, never dropped
- Pillars stay rare: surface a pillar candidate only for a timeless, cross-cutting belief not already covered — default to ephemeral, and never mint or evolve a pillar here (that is `/opsx:pillar`)
- The light research pass is bounded: read-only, planning-only, a few lookups to shape the 0→1 map and depth calls — never a per-item deep dive (that is `/opsx:brief deep`) and never implementation
- Contentious calls are surfaced with a recommendation, never resolved silently
- This command plans — it never writes application code or creates change proposals
