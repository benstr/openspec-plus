Backlog protocol (openspec-backlog):
- `openspec/backlog/backlog.md` is the ONLY authority for development order. OpenSpec owns
  status: `openspec list` = in flight, `openspec/changes/archive/` = done. Never hand-write "done".
- The pointer target IS the row's status: `—` → `briefs/<name>.md` → `openspec/changes/<name>/`
  → row removed when the change archives. Remove a row only when its change archives.
- When proposing a change that has a ledger row: use its working brief at
  `openspec/backlog/briefs/<name>.md` as the PRIMARY input, then MOVE the brief to
  `openspec/backlog/archive/`, repoint the row to `openspec/changes/<name>/` under
  `## In flight`, and create `worklog.md` from `openspec/backlog/templates/worklog.md`.
- During apply: run the capture sweep (dedup first, additive only) and keep the change's
  worklog current per `openspec/backlog/README.md` — read its State first, write ahead of
  each task, append every subagent's digest the instant it returns, record dead ends.
- SERIALIZE: one item's propose/apply at a time — a bulk objective means repeating the
  one-item cycle, never fanning out. A HARD dependency must be ARCHIVED before its dependent
  is proposed. Subagents may parallelize research and briefing; the ledger is single-writer.
