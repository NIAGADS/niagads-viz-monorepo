# AI & Copilot Code Change Policy

## Token and usage budget

- Keep work within the requested scope. Avoid repeated file reads,
  broad searches, redundant checks, and verbose tool output.
- Read only relevant files and sections. Reuse information already
  gathered unless changes require another read.
- Do not launch subagents unless explicitly requested.
- Run targeted checks first. Repeat checks only after relevant changes
  or when investigating a failure.
- Keep progress updates and final reports concise.

### Usage limits and pausing

- Do not invent remaining token counts, usage percentages, or reset times.
  Use usage information only when explicitly available from the platform
  or supplied by the user.
- If an explicit usage warning appears, finish the current small,
  coherent step when possible, then checkpoint and stop.
- If a usage limit blocks progress, do not repeatedly retry or switch
  models to bypass it.
- Before stopping, record in CHECKPOINT.md:
  - Completed work and changed files.
  - Checks run and their results.
  - Remaining work and the exact next step.
  - Any known usage reset time.
- Resume from that checkpoint when the user returns after the reset.

## Code Change Requirements

- AI-generated code must be reviewed for formatting, style, and logical placement before submission. This can also be accomplished with `npm run lint` at the project root

## Implementation Checklist

- Avoid redundant code and helper functions that unnecessarily wrap single lines of code
- Before adding code, search for and reuse existing project utilities, components, and Pydantic models that fit the task.
- Always review and match project conventions, formatting, and style.
- Place imports, constants, and docstrings in logical order.
- Avoid duplicate imports and code blocks.
- Add extra blank spaces between large code blocks for readability.
- Never take credit for user changes.
- Only alter comments if either requested or necessary for documenting core code modifications, additions, etc.
- Do not do inline imports unless necessary to avoid circular imports in the package.
- Avoid nested function defintions unless absolutely necessary.
- Ensure docstrings and comments are concise, relevant, and professional—focused on what the function does and why, not its visibility or trivial details.
- Do not invent fallback defaults that hide missing, invalid, or failed data. Follow the project’s established error-handling behavior.
- Implement only the requested behavior. Do not add abstractions or support for unrequested use cases.
- Before creating a component or adding class behavior, inspect nearby code and search the project for relevant components and utility functions.

## Performance Considerations

- Add checks and defensive handling only for conditions that can occur in the requested use case or are required by the project.  Too many unneccessary checks can slow down.  My code deals with Enterprise Scale data.
- Avoid repeated iterations over data structures when the work can be done in one pass or with an existing project utility.
- Consider parallelization for iterations over large data.

## Additional Requirements

- Always use javascript/react best practices when inserting new code.
- Review codebase (files in same or parent folder, or all files in context) when implementing new files to keep conventions, style, and big picture of the project instead of writing generic code solutions.
- Pay attention to formatting, making sure that new code is not necessarily inserted at current cursor but where it logically flows in the existing files.
- Do not lecture; just focus on explicit tasks/requests. Only make suggestions when asked directly
- Always aske for clarification when there are multiple paths that need to be evaluated or context is unclear.
- If project instructions, configuration, and existing code patterns conflict, follow the explicit instruction or configuration that applies to the task. Don’t copy a nearby pattern that contradicts it.
- After editing, review the diff and run the relevant focused checks. Report any checks that could not be run.

---

For unclear conventions or missing documentation, ask maintainers for clarification. Update this file as new patterns emerge.
