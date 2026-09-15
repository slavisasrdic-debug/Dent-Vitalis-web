# OPTIMIZATION RULES — QUALITY FIRST, EFFICIENT EXECUTION

Work efficiently and minimize unnecessary model, tool, browser, and repository usage without reducing implementation quality.

## 1. QUALITY HAS PRIORITY

- Never skip a necessary validation, test, security check, or final visual verification just to save usage.
- If efficiency and correctness conflict, choose correctness.
- Do not declare a task complete until the relevant functionality has been verified.

## 2. UNDERSTAND BEFORE ACTING

- First identify the smallest relevant part of the codebase.
- Do not scan or analyze the entire repository unless the task genuinely requires it.
- Prefer targeted search by filenames, symbols, imports, routes, database tables, components, or known dependencies.
- Reuse information already discovered during the current task instead of repeatedly rereading the same files.

## 3. BATCH RELATED CHANGES

- Plan related modifications together and implement them in one coherent pass.
- Avoid the pattern:
  edit → test → edit → test → edit → test
  when several predictable changes can safely be made before testing.
- Prefer:
  inspect → understand → implement related changes → test → correct remaining issues → final verification.

## 4. BROWSER / COMPUTER USE

- Do not open or refresh the browser after every small code or CSS change.
- Complete a meaningful batch of changes first, then perform browser verification.
- During visual work:
  a) inspect the reference/current state,
  b) implement the main changes,
  c) perform one visual review,
  d) group all detected differences,
  e) fix them together,
  f) perform a final visual verification.
- Use additional browser iterations only when the result is uncertain or a real issue remains.
- Do not repeat screenshots or inspections when nothing relevant has changed.

## 5. TESTING

- During development, run the smallest relevant test/build/lint command that can verify the change.
- Do not repeatedly run the entire test suite for small isolated changes.
- Run broader tests when the change affects shared infrastructure, multiple modules, routing, authentication, database structure, build configuration, or other cross-cutting functionality.
- Do not rerun an unchanged successful check without a reason.
- Always perform an appropriate final verification before completing the task.

## 6. DEBUGGING

- Diagnose before making speculative changes.
- Read the actual error, stack trace, relevant code path, logs, network response, database query, or browser console before trying fixes.
- Avoid random trial-and-error loops.
- Form a likely cause, test it, then make the smallest justified change.
- If the first approach fails, reassess the cause instead of repeating similar changes.

## 7. WEB / CMS / CRM DEVELOPMENT

- For backend work, avoid browser testing until the underlying implementation is sufficiently complete unless browser behavior is necessary to diagnose the issue.
- For frontend work, use browser inspection strategically at meaningful checkpoints.
- For database changes, inspect only the relevant schema, queries, models, and migrations unless wider dependencies are indicated.
- Preserve existing architecture and conventions unless there is a concrete reason to change them.

## 8. OUTPUT

- Keep progress commentary concise.
- Do not produce long explanations of routine changes unless requested.
- Prefer doing the work over narrating every step.
- At completion, briefly state:
  - what changed,
  - what was verified,
  - any unresolved issue or risk.
- Do not repeat information already given.

## 9. SCOPE CONTROL

- Stay within the requested task.
- Do not refactor unrelated code simply because it could be improved.
- If an unrelated issue blocks the requested task, fix only what is necessary and explain it briefly.
- If a proposed change would substantially expand scope, stop and flag it before proceeding.

## 10. AUTONOMY

- Do not ask for confirmation for routine implementation decisions when the existing codebase provides a clear convention.
- Ask only when a decision is genuinely ambiguous, destructive, security-sensitive, changes public behavior significantly, or requires a product/business choice.

## 11. EFFICIENCY PRINCIPLE

Use the minimum number of reads, searches, tool calls, browser interactions, and execution cycles necessary to reach a high-confidence result.

This does NOT mean doing less verification.
It means avoiding redundant work.

The preferred workflow is:

UNDERSTAND → PLAN BRIEFLY → IMPLEMENT IN BATCH → TARGETED TEST → FIX AS A GROUP → FINAL VERIFY → STOP

Do not continue exploring, testing, browsing, or modifying the project after the requested task is correctly completed.
