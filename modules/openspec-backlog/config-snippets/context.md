Backlog protocol (openspec-backlog):
- `backlog.md` alone owns order; OpenSpec owns status (`list` = in flight, `archive/` = done).
- Read README, live ledger header, and brief template before edits; preserve all columns/order.
  If `product-areas.md` exists, use its catalog; otherwise invent no Product Area taxonomy.
- Pointer target is status: `—` → `briefs/<name>.md` → `openspec/changes/<name>/` → row removed.
- At propose, use the brief as PRIMARY input, then move it to `backlog/archive/`, repoint/move
  the row under In flight, and create the change worklog from `backlog/templates/worklog.md`.
- During apply, run the deduped additive capture sweep; read/write-ahead the worklog and record
  each subagent digest and dead end immediately. Never hand-write done or remove before archive.
- CONCURRENCY: absent/unreadable/malformed/unsupported `concurrency.json` is serial. Only exact
  `owner-scoped-v1`/schema v1/WIP 2 allows evaluation for a second implementation.
- Profile is a ceiling: one manager serializes claims/ledger; dependencies must be archived;
  Owner Scope/Engineer differ; base, context, capacity, isolation, and surfaces must all pass.
- `/opsx:next`, conflicting integration, sync, merge, and archive remain one-item/single-writer.
