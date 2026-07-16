# delivery-depth

## The belief

Delivery depth matches the objective. Work moves **Minimal → Optimized → Production**:
first prove the smallest truthful outcome, then improve what evidence says matters, then
broaden only when a named trigger demands it. Architecture and trust invariants are the
floor at every depth; only the depth of operational proof changes.

## Why it matters

A project has to learn quickly without building throwaway structure, and it has to harden
without mistaking production ceremony for progress. If every experiment must first survive
the broadest production certification, the work becomes slow, fragile, and expensive before
it has proved any value. If a prototype is presented as production-ready without the
corresponding evidence, trust collapses. Declaring the objective and applying its exact
gate keeps investment proportional while preserving the same disciplined structure all the
way through.

## What it means in practice

Every OpenSpec change proposal declares exactly one delivery depth — **Minimal**,
**Optimized**, or **Production** — in a `## Depth` section, stating its boundary in one
sentence. Depth is a scope boundary, not a release phase, marketing label, or quality
score. A change cannot combine depths, and every requirement, design decision, task, test,
and documentation deliverable in the change must be necessary at its declared depth.

- **Minimal — prove the capability works truthfully.** Include only the smallest complete
  outcome and the evidence to show it does what it claims: the essential happy path,
  refusal of invalid or unsafe input, and truthful incomplete/failure states. Do not add
  speculative performance tuning, broad failure matrices, generalized recovery, or
  future-consumer abstractions. Minimal is a scope boundary, never a license to cut
  corners on structure or safety.
- **Optimized — improve something that already works.** Start from evidence that the
  capability's intended path works. Limit work to measured or reasonably expected
  constraints on that existing path: latency, resource use, common failures, hardening,
  operational clarity, maintainability. Every task states its observed risk, target, or
  acceptance measure. No new product outcomes, audiences, or integrations unless strictly
  needed to meet the stated target.
- **Production — prepare a working, reasonably optimized capability for broader use.** The
  proposal names the trigger: a new audience, integration, scale class, compliance
  obligation, or general-availability gate. Add only the breadth that named trigger
  demands — never use Production as a container for unrelated cleanup or hypothetical
  future needs.

The architecture and trust floor applies at every depth. A Minimal change may be smaller,
but it may not create a back door, bypass ownership boundaries, weaken authorization, or
make a false readiness claim. Optimized and Production may deepen those controls; they do
not introduce them for the first time.

**Review discipline.** At propose time, adversarially classify every requirement, design
decision, task, test, and documentation output as **within depth**, a **required boundary
exception**, or **out of depth**. A proposal is not apply-ready while an item is
unclassified. Each boundary exception gets exactly one recorded disposition:

- **Keep** — only when omitting it would make the declared outcome false, unsafe,
  structurally non-conformant, or impossible to verify. Record the exception and its
  rationale in the change's design, and keep its tasks as narrow as that rationale.
- **Purge** — when it is unnecessary at the declared depth. Remove the requirement,
  design, tasks, and tests rather than leaving dormant complexity.
- **Defer** — when it is valid work at another depth. Deduplicate it first, then capture
  it: as a Backlog Ledger item with the proper depth when the openspec-backlog module is
  installed, otherwise in the proposal's Out of Scope section. The current change must
  not implement it.

Implementation discoveries use the same three-way disposition. Crossing a depth boundary
mid-change is a planning event: stop, adjudicate, update the artifacts, and only then
continue.

## What violates it

- Omitting the proposal's `## Depth` section, or declaring more than one depth.
- Letting a requirement, task, or test cross the declared boundary without a recorded
  keep/purge/defer disposition.
- Treating an architecture or trust invariant as optional "later hardening."
- Presenting a Minimal outcome as production-ready — or demanding Production ceremony
  before anything has proved value.
- Using Production breadth with no named trigger.

## Children

None yet — specs that enrich this pillar are listed here as the project cites it.

## Bindings

Where this pillar is enforced:

- **Change proposals (always):** every proposal carries a `## Depth` section declaring
  exactly one of Minimal | Optimized | Production plus its one-sentence boundary —
  enforced by the openspec-plus rule injected into `openspec/config.yaml`
  (`rules.proposal`).
- **Backlog ledger (when the openspec-backlog module is installed):** each row in
  `openspec/backlog/backlog.md` carries a Depth column — the row-level projection of the
  depth its proposal will declare. Assign the smallest truthful depth — judged against the
  item's objective **on the path to the recorded ideal end-state** (a brief's `## Intended
  outcome`), not the item in isolation; that recorded intent is a legitimate source of the
  evidence Optimized needs or the trigger Production names, so a higher-depth waypoint is
  justified, not padding.
- **Verification gates (project-defined):** the commands a change must pass before
  archiving live with the project (e.g. a `## Verification` section in the backlog
  README). The pillar constrains scope; the project chooses its gates.
