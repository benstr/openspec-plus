---
id: backlog
description: Turn messy context into ordered, deduplicated backlog items - a ledger row plus lite working brief per item
---
Capture backlog work. Turn messy context — goals, research, PRDs, audit findings, a conversation — into ordered, deduplicated items in the backlog ledger.

**This is grain 1: right-size and order, don't deep-plan.** Each new item gets a **lite working brief** (an honest preliminary capture) plus a row in `openspec/backlog/backlog.md`. Deep planning happens later, at pick-up time, via `/opsx:brief` — a deep brief written now would rot before it's used.

**Store selection:** If the user names a store (a store is a standalone OpenSpec repo registered on this machine) or the work lives in one, run `openspec store list --json` to discover registered store ids, then pass `--store <id>` on the commands that read or write specs and changes (`new change`, `status`, `instructions`, `list`, `show`, `validate`, `archive`, `doctor`, `context`). Other commands do not take the flag. Hints printed by commands already carry the flag; keep it on follow-ups. Without a store, commands act on the nearest local `openspec/` root.

**Input**: The argument after `/opsx:backlog` is free-form context to capture — goals, research notes, a PRD, audit findings — or nothing, in which case work from what the conversation surfaced (when invoked as a skill, take the equivalent from the user's request).

**Steps**

1. **Read the conventions and the ledger first**

   Read `openspec/backlog/README.md` (the rules) and `openspec/backlog/backlog.md` (the ledger) before touching either. The ledger is the ONLY authority for development order; OpenSpec owns status. The pointer column IS each row's status — there is no status field to edit.

   If `openspec/pillars/` exists, read `openspec/pillars/DEFINITIONS.md` and `openspec/pillars/README.md` first: resolve vocabulary through DEFINITIONS.md, prefer canonical terms, and never coin an undefined word.

2. **Dedup against all three surfaces**

   Before creating anything, check every candidate item against:
   - `openspec/changes/archive/` — already done
   - `openspec list --json` — in flight
   - existing ledger rows — already planned

   Never re-plan finished or in-flight work. Context that sharpens an existing Upcoming item belongs in that item's brief (append a dated note), not in a new row.

3. **Split the input into right-sized items**

   Each item = one coherent future change. Derive a kebab-case name per item (e.g., "let users export their reports" → `report-export`) — the name is the item's identity and its future `openspec/changes/<name>/` directory. Too big (multiple independent outcomes) → split. Fragments of one outcome → merge.

4. **Create a lite brief per NEW item**

   Copy `openspec/backlog/templates/brief.md` to `openspec/backlog/briefs/<name>.md` and fill in only what the input honestly supports, marked:

   > **Preliminary capture — deepen with /opsx:brief before propose.**

   State open questions as open questions. A thin honest brief beats a padded one.

   If `openspec/pillars/` exists, note candidate pillars the item leans on in the brief's `## Pillars` section; if no pillar fits, record that as a missing-pillar question rather than inventing one.

5. **Insert rows in dependency-and-value order**

   Add one row per new item under `## Upcoming` in `openspec/backlog/backlog.md`:

   ```
   | <name> | <deps> | briefs/<name>.md (**lite**) |
   ```

   Row position within a section is development order — place each row where its dependencies allow and its value dictates. Bare names in `Depends on` are hard deps; prefix `soft:` for sequencing preferences. If the ledger groups Upcoming into wave subsections (an optional pattern the README documents), insert within the appropriate wave.

   If `openspec/pillars/delivery-depth.md` exists, assign each row the smallest depth (`Minimal | Optimized | Production`) that can truthfully achieve the item's objective — in the ledger's `Depth` column and the brief's `**Depth:**` line, with a one-sentence boundary.

6. **Revise existing Upcoming rows where new context changes the picture**

   You may split, merge, enrich, and reorder existing **Upcoming** rows when the new context genuinely changes the shape of planned work. NEVER touch `## In flight` rows. When a call is contentious — a possible duplicate, a disputed ordering, scope that might belong to an in-flight change — do not act silently: surface it to the user with your recommendation and wait.

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
```

Finding nothing new to capture is a valid outcome — say so in one line, don't invent items.

**Guardrails**
- Read `openspec/backlog/README.md` before every ledger edit — the conventions are strict
- Dedup before minting: archive, `openspec list --json`, existing rows — always all three
- The ledger points, never copies — context lives in briefs; rows stay one line
- Never touch In flight rows; never hand-write "done" — OpenSpec owns status
- Preliminary captures stay honestly preliminary — open questions stay open, not guessed shut
- Contentious calls are surfaced with a recommendation, never resolved silently
- This command plans — it never writes application code or creates change proposals
