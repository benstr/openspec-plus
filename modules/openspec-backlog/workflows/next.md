---
id: next
description: Autonomously process exactly ONE backlog item end-to-end - brief, propose, apply, verify, sync, archive; designed for /loop and /goal
---
Process exactly **one** item from `openspec/backlog/backlog.md` through the full lifecycle, autonomously.

Two loops — don't confuse them: the **outer loop** is your harness's loop driver stepping through ledger rows — `/loop /opsx:next`, or `/goal` with an objective like "run /opsx:next until it reports LOOP STOP" — one item per invocation; the **inner loop** is apply working through a change's entire tasks list (that loop already lives in the stock apply flow — don't re-implement it here).

This command **composes** the sibling and stock commands: the `/opsx:brief` flow, then the stock `/opsx:propose` → `/opsx:apply` → `/opsx:sync` → `/opsx:archive` flows. Stock command behavior stays authoritative for everything not listed in the autonomy overrides at the bottom.

**Store selection:** If the user names a store (a store is a standalone OpenSpec repo registered on this machine) or the work lives in one, run `openspec store list --json` to discover registered store ids, then pass `--store <id>` on the commands that read or write specs and changes (`new change`, `status`, `instructions`, `list`, `show`, `validate`, `archive`, `doctor`, `context`). Other commands do not take the flag. Hints printed by commands already carry the flag; keep it on follow-ups. Without a store, commands act on the nearest local `openspec/` root.

**Input**: The argument after `/opsx:next` is empty — this command takes no arguments (when invoked as a skill, take the equivalent from the user's request). The ledger alone picks the item; nothing in the request overrides its order.

**Steps**

0. **Read the ground rules**

   Read `openspec/backlog/README.md` before anything else. If `openspec/pillars/` exists, read `openspec/pillars/DEFINITIONS.md` and `openspec/pillars/README.md` first, plus `openspec/pillars/delivery-depth.md` if present — the item's declared depth must be preserved through every stage below; a mismatch is a hard stop, not something to smooth over.

   Read `openspec/backlog/concurrency.json` from disk now. Owner-scoped parallel implementation
   exists only when it is a JSON object with exactly `$schema:
   "./templates/concurrency-profile.schema.json"`, `schemaVersion: 1`, `profile:
   "owner-scoped-v1"`, and `implementationWipLimit: 2`, with no extra keys. Missing, unreadable,
   malformed, unknown, stale, or differently valued input means serial. Generated prose, a ledger
   Concurrency cell, or a prior successful install never substitutes for this live check.

   `/opsx:next` remains one-item end-to-end in either mode. A valid profile permits a separate,
   serialized Engineering Manager admission path to accept at most two independent implementation
   claims; it does not permit concurrent empty-argument `/opsx:next` selection, ledger mutation,
   proposal admission, sync, merge, or archive.

   That manager may admit a second lane only when fewer than two implementation claims are active,
   every hard dependency is archived, the candidate is not `Serialized`, its primary Owner Scope
   and Engineer are distinct from all active claims, its base and governing context are fresh,
   its branch/worktree/worklog/PR are isolated, no supporting path collides with an active
   serialized surface, and current manager/review/CI/merge/recovery capacity permits the lane.
   Same Owner Scope, same Engineer, proposed-only dependency, third lane, stale capacity, or any
   serialized-surface collision denies admission. Satisfying every condition permits overlap but
   never requires filling the second lane.

1. **Pick the item — from the ledger, nothing else**

   Read `openspec/backlog/backlog.md`. The ledger is the sole picker; the pointer column is the state.

   - **An In flight row exists** → that's the item (topmost, if a manager has admitted two).
     - Read `openspec/changes/<name>/worklog.md` `## State` **FIRST** — the durable memory of every prior session on this item; trust it over instinct.
     - Then run `openspec status --change "<name>" --json` and route:
       - any `applyRequires` artifact not `done` → **step 3** (resume the artifact loop; the brief in `briefs/` is still the primary input)
       - all `applyRequires` done, tasks file has unchecked `- [ ]` boxes → **step 4**
       - every box checked → **step 5**
   - **Otherwise** → the topmost `## Upcoming` row whose `Depends on` entries are all satisfied. A dependency is satisfied when it has no ledger row and a matching `openspec/changes/archive/*-<dep>/` exists (or it was never a change name). `soft:` entries are sequencing preferences, not blockers. Skip blocked rows; never reorder them.
   - **No eligible row, or the ledger is empty** → print `LOOP STOP: <reason>` and end. Do not schedule anything.

   The pointer determines the entry stage: `—` or `briefs/<name>.md` (**lite**) → step 2; `briefs/<name>.md` (**briefed**/**deep**) → step 3; `openspec/changes/<name>/` → step 4 (or step 3 when `applyRequires` is incomplete — see the In flight rule above). The item then flows through all remaining stages in this one invocation.

2. **Brief (pointer `—` or lite brief)**

   Run the `/opsx:brief` flow for this item, autonomously: investigate the codebase read-only, create or deepen `openspec/backlog/briefs/<name>.md` from `openspec/backlog/templates/brief.md`, and repoint the row to `briefs/<name>.md` (**briefed**). Do not offer or ask — write it. The brief flow may, per its own rules, raise this item's depth or mint additional deduplicated **upcoming** waypoint rows from the recorded `## Intended outcome`; a contentious depth change or spawn is a hard stop (see guardrails), not a silent autonomous action.

3. **Propose (pointer `briefs/<name>.md`)**

   Run the stock `/opsx:propose` flow with the change name explicit — no selection prompt. Read the brief first: it is the PRIMARY input for `proposal.md` and `design.md`. Then the artifact loop:

   ```bash
   openspec new change "<name>"
   openspec status --change "<name>" --json
   openspec instructions <artifact-id> --change "<name>" --json
   ```

   Create artifacts in dependency order until every artifact in `applyRequires` has `status: "done"`. (Resuming an interrupted propose: the change already exists — skip `openspec new change` and re-enter the artifact loop.)

   **Then hand off — all of these, in order:**
   1. MOVE the brief to `openspec/backlog/archive/<name>.md` (a lingering active brief would be stale — the thinking now lives in the change artifacts).
   2. Repoint the ledger row to `openspec/changes/<name>/` (**proposed**).
   3. Move the row under `## In flight`.
   4. CREATE `openspec/changes/<name>/worklog.md` from `openspec/backlog/templates/worklog.md`;
      seed its `Now:`/`Next:` from the task plan — it is the change's durable memory from here on.
      Before implementation, record the primary Owner Scope, one accountable Engineer, integration
      base, profile revision/status, current downstream-capacity observation, assigned isolated
      branch/worktree/PR, and named serialized surfaces. Commit this serialized claim transition
      before implementation begins or another candidate is evaluated.

4. **Apply (pointer `openspec/changes/<name>/`)**

   **Worklog discipline first — this is what survives compaction; follow it exactly.** Read `openspec/changes/<name>/worklog.md` `## State` and honor `Do NOT redo` before doing anything (no worklog yet → create it from `openspec/backlog/templates/worklog.md`). Throughout apply:
   - Update `Now:` BEFORE starting each task; append an entry AFTER finishing it.
   - The INSTANT any subagent returns, append its digest — finding, file paths, verdict, what NOT to redo — BEFORE acting on the result. A subagent's insight exists only in your context until it is written; never batch digests for later.
   - The moment an approach fails, record it under `Do NOT redo` ("tried X — failed because Y").
   - A task too big for one session: append `### Plan: <task>` with numbered sub-steps to the worklog and tick them as you go — progress inside the task must survive compaction too.
   - Before starting any task, check the worklog for evidence it already happened; verify on disk, then skip. Never re-derive what is recorded.

   Then run the stock `/opsx:apply` flow with the change name explicit: read every context file from `openspec instructions apply --change "<name>" --json`, work through the tasks, and tick each checkbox (`- [ ]` → `- [x]`) as it completes.

   Before privileged repository mutation and again before review handoff, integration/merge,
   current-spec synchronization, and archive, re-read the live profile and reconcile all active
   claims from OpenSpec, ledger pointers, worklogs, and Git evidence. Re-check claim identity,
   distinct Owner Scope and Engineer, archived dependencies, base/context freshness, serialized
   surfaces, external-mutation fences, and current manager/review/CI/merge/recovery capacity.
   Any missing, stale, conflicting, or over-limit evidence fences the affected transition and
   preserves accepted work; profile revocation stops new second-lane admission and reconciles
   active work toward serial operation.

   Before committing, run the **backlog capture sweep** per `openspec/backlog/README.md`: harvest deferred/out-of-scope discoveries into brief notes or new rows + lite briefs — dedup first, additive only, never reorder during apply. An ambiguous finding (possible duplicate, contentious ordering, scope question) is a hard stop, not a silent judgment call.

   On full completion, commit: stage the change directory and every file the tasks touched (never unrelated dirty files), subject from the proposal's why, plus `OpenSpec-Change: <name>` in the body. Apply's pause rules stand — an unclear task, an error, or an implementation-revealed design issue is a hard stop; the change stays in flight and the next invocation resumes it.

5. **Verification gate**

   Run the command(s) listed in the `## Verification` section of `openspec/backlog/README.md`.
   - Section missing or empty → warn in the report and treat as pass.
   - Any command fails → hard stop: report the failing output, do NOT archive, print `LOOP STOP: verification failed on <name>`.

6. **Sync, then archive**

   Run the stock `/opsx:sync` flow, then the stock `/opsx:archive` flow, with the change name explicit. Always sync before archive — this pre-answers archive's sync-or-skip prompt. After the change is archived, remove the item's row from `openspec/backlog/backlog.md`. Done work lives only in `openspec/changes/archive/` — never add a "done" entry anywhere.

7. **Iteration report** — end every invocation with the report in **Output** below, even a stop on step 1.

**Output**

```
## /opsx:next — <item-name>

**Stages run:** <e.g. brief → propose → apply → verify → sync → archive>
**Depth:** <Minimal | Optimized | Production — only when the depth pillar is installed>
**Commits:** <short sha(s) + subjects — or "none">
**Backlog captured:** <briefs enriched / rows added by the capture sweep — or "none">
**Next eligible item:** <name — or "none">

LOOP CONTINUE  |  LOOP STOP: <reason>
```

`LOOP CONTINUE` only when the item archived cleanly AND another eligible row remains. `LOOP STOP: <reason>` in every other case.

**Autonomy overrides (apply only within this command)**

- The item/change name is always passed explicitly downstream — none of the composed flows' selection prompts should ever fire.
- Brief's "offer, don't auto-capture" is overridden: write the brief directly.
- Archive's selection and sync-or-skip prompts are overridden: always sync, then archive.
- Everything else in the sibling and stock commands stands.

**Guardrails**

- **Hard stops — never push through; report and end with `LOOP STOP: <reason>`:**
  - verification-gate failure
  - apply blocker: unclear task, error, or implementation revealing a design issue
  - ambiguous capture-sweep finding — surface it with a recommendation, don't act silently
  - dependency cycle or no eligible row
  - ledger ↔ OpenSpec disagreement (OpenSpec wins; fix the ledger only if the fix is unambiguous, otherwise stop)
  - depth mismatch or unresolved depth boundary (only when the depth pillar is installed)
- Never reorder ledger rows or edit them beyond what the steps above prescribe.
- The worklog rules in step 4 are not optional: an unwritten subagent digest or an undecomposed oversized task is exactly how long loops die at compaction.
- One item per invocation. If the item was already mid-lifecycle, finishing it counts as the item.
- **Bulk objectives change nothing.** A `/goal` or request covering many items or whole waves is satisfied by REPEATING this one-item cycle:
  - never race selection or admission and never fan items out to parallel `/opsx:next` runs
  - without the exact valid profile, never overlap propose/apply across items
  - with the exact valid profile, only a serialized Engineering Manager may separately admit a
    second implementation after proving the full owner/scope/dependency/isolation/capacity contract
  - subagents parallelize *within* a stage only (investigation, research, tests)
  - the ledger stays single-writer; the concurrency contract in `openspec/backlog/README.md` binds here
- Every invocation ends with the iteration report — even a stop on step 1.
