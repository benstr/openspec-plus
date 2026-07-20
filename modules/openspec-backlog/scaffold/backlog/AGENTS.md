# AGENTS.md — openspec/backlog

Agent lens for this folder: orientation plus tripwires. The conventions live in
[README.md](README.md) — read it before touching anything here.

- **`backlog.md` is the only authority for development order.** Roadmaps, PRDs, audits, and
  research are scope input — read them for *what*, never for *what order*.
- **OpenSpec owns status.** `openspec list` = in flight; `openspec/changes/archive/` = done.
  The row's pointer target *is* the status. If ledger and OpenSpec disagree, OpenSpec wins —
  fix the ledger. Never hand-write "done" anywhere.
- **Never reorder In flight rows.** Planning passes act on Upcoming only; the apply-time
  capture sweep is additive only (rows and brief notes appended, nothing moved or deleted).
- **Dedup before minting.** A "new" item must clear all three surfaces first:
  `openspec/changes/archive/` (done), `openspec list` (in flight), existing rows (planned).
- **Preliminary captures stay honestly preliminary.** A lite brief records outcome and
  boundaries with open questions stated as open questions — never dressed up as finished
  thinking, and never proposed without deepening (`/opsx:brief`).
- **Ambiguity → surface, don't act.** Possible duplicate, contentious ordering, unclear scope
  boundary: present it to the user with a recommendation instead of deciding silently.
- **The ledger points; it never copies.** Deep context lives in `briefs/<name>.md` until
  propose, then in `openspec/changes/<name>/`. A pointer cell carries a target, a bold state
  label, and at most a short note — never a restatement of the brief.
- **Preserve repository metadata.** Read the live ledger header and brief template before every
  edit; round-trip every declared column in place. If `product-areas.md` exists, use one primary
  Product Area in row and brief and supporting areas only in the brief.
- **Concurrency fails closed.** Missing or invalid `concurrency.json` means serial. Exact
  `owner-scoped-v1`/schema v1/WIP 2 only permits one manager to evaluate a second independent
  implementation; it never authorizes work by itself.
- **Admission and finalization stay single-writer.** Serialize claim/ledger transitions,
  conflicting shared surfaces, integration/merge, spec sync, and archive. Re-check live profile,
  ownership, dependencies, freshness, isolation, and downstream capacity before privileged work.
