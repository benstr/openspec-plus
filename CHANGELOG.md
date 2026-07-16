# Changelog

All notable changes to `@benstr/openspec-plus` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_Nothing yet._

## [0.2.0] - 2026-07-16

### Added
- **End-state intent capture in `/opsx:backlog`.** Capture now reads the user's ideal
  end-state, runs a bounded read-only research pass, and sketches a 0→1 map — minting items at
  a mix of depths along it instead of a flat pile of Minimal tasks.
- **`## Intended outcome` brief section.** Every working brief records its per-item slice of the
  end-state (no central artifact). `/opsx:brief` and propose read it to judge depth and whether
  further items are warranted.
- **Ephemeral-vs-durable pillar triage.** When the pillars module is installed, a durable,
  cross-cutting belief surfaced during capture or deep-brief is recommended for `/opsx:pillar`
  consideration — behind a deliberately high bar (timeless, cross-cutting, not already covered)
  so pillars stay rare. Surfaced as a recommendation, never auto-authored.

### Changed
- **Reconciled the delivery-depth rule.** Depth is judged as the smallest truthful depth *on the
  path to the recorded intent*, not the item in isolation — the recorded end-state is the
  pillar's named trigger/evidence, so a higher-depth waypoint is justified, not padding. The
  architecture/trust floor is unchanged at every depth.
- **`/opsx:brief` may raise depth or spawn follow-on waypoints** when investigation shows the
  end-state needs them, surfacing contentious calls rather than acting silently.
- **delivery-depth pillar:** additive Bindings clarification (no supersession).
- **Restyled the backlog workflows** (`backlog`, `brief`, `next`) to OpenSpec's rules-based
  bullet form — bold-lead labels, one-rule-per-bullet, ordered checklists — for more predictable
  agent output, with no behavioral changes.

### Notes
- Installed projects pick up new behavior from the refreshed command/skill files on re-run. The
  new brief-template section and README notes appear in fresh installs only — existing scaffold
  files are never overwritten.

## [0.1.0] - 2026-07-15

### Added
- Initial release: two opt-in modules that install into an existing OpenSpec project.
  - **openspec-backlog** — an ordered backlog ledger, a mutable working brief per item, and the
    `/opsx:next` autonomous lifecycle runner (`/opsx:backlog`, `/opsx:brief`, `/opsx:next`).
  - **openspec-pillars** — timeless-belief pillars, a controlled-vocabulary resolver, and the
    preinstalled delivery-depth discipline (`/opsx:pillar`, `/opsx:definition`).
- Zero-dependency installer (`install.mjs`) for Claude, Codex, and Cursor: idempotent,
  marker-guarded `openspec/config.yaml` wiring, managed `AGENTS.md` block, and cross-module
  integration hooks (e.g. the ledger `Depth` column). Tolerant of CRLF/Windows checkouts.
- Published as the scoped npm package `@benstr/openspec-plus` (`npx @benstr/openspec-plus`).

[Unreleased]: https://github.com/benstr/openspec-plus/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/benstr/openspec-plus/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/benstr/openspec-plus/releases/tag/v0.1.0
