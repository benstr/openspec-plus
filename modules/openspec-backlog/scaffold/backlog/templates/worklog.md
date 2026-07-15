# Worklog: <change-name>

<!--
This file is the change's durable memory. Context windows get compacted; this file does not.
If you are reading this with no memory of writing it — that's the design. Trust it.

THE FIVE RULES — the difference between finishing and cycling forever:
1. READ FIRST. Start every work session by reading ## State and scanning "Do NOT redo".
2. WRITE AHEAD. Update "Now:" BEFORE starting a task; append an entry AFTER finishing it.
   A context wipe at any instant must leave a fresh trail.
3. SUBAGENT DIGEST (critical). The INSTANT a subagent returns, append its digest — finding,
   file paths, verdict, what NOT to redo — BEFORE acting on the result. A subagent's insight
   exists only in your context until it is written here. Never batch digests for later;
   later may not exist.
4. TRUST THE LOG. Before starting any task, check below for evidence it already happened;
   verify on disk (committed code, passing tests, ticked boxes), then skip. Do not re-derive
   what is already recorded.
5. DEAD ENDS. The moment an approach fails, record "tried X — failed because Y". That line
   is what breaks the endless retry cycle.

Task too big to finish in one session? Decompose it HERE: append "### Plan: <task>" with
numbered sub-steps under ## Entries and tick each as it completes — progress INSIDE a task
must survive compaction too. tasks.md keeps the change's granularity; this file carries the
finer grain.

## State is REWRITTEN in place — keep it under ~30 lines. ## Entries is append-only.
-->

## State

Now: <task being worked — update BEFORE starting it>
Next: <the next concrete action after Now>
Decisions:
- <call made + one-line why>
Do NOT redo:
- <dead end — "tried X, failed because Y">
Environment:
- <quirk discovered — e.g. "integration tests need the dev server on :4000">

## Entries

- [<date>] worklog created
