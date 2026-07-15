Backlog protocol (openspec-backlog):
- `openspec/backlog/backlog.md` is the ONLY authority for development order. OpenSpec owns
  status: `openspec list` = in flight, `openspec/changes/archive/` = done. Never hand-write "done".
- The pointer target IS the row's status: `—` → `briefs/<name>.md` → `openspec/changes/<name>/`
  → row removed when the change archives.
- When proposing a change that has a ledger row: use its working brief at
  `openspec/backlog/briefs/<name>.md` as the PRIMARY input for the proposal and design, then
  MOVE the brief to `openspec/backlog/archive/`, repoint the row to `openspec/changes/<name>/`,
  and move the row under `## In flight`.
- During apply: run the backlog capture sweep (dedup first, additive only) AND maintain the
  change's worklog `openspec/changes/<name>/worklog.md` (create from
  `openspec/backlog/templates/worklog.md`) per `openspec/backlog/README.md` — read its State
  before working, update `Now:` ahead of each task, append every subagent's digest the
  instant it returns, and record dead ends the moment they fail.
- Remove a row only when its change archives. Read `openspec/backlog/README.md` before touching the ledger.
