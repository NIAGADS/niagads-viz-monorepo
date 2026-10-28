# ASK NIAGADS frontend development notes

This directory contains context for continuing ASK frontend work in
`apps/open-access-api-client`.

## Branches

- Development base: `feature/ask-niagads`.
- Create feature branches from the updated development base, prefixed `ask-niagads`, e.g., `codex/ask-naigads-<...>`
- Confirm the current branch and preserve local changes before editing.
- Historical handoffs may name branches that have since been merged or deleted.

## Start here

1. Read the repository’s root `AGENTS.md`.
2. Read [HANDOFF.md](HANDOFF.md) for current scope and decisions.
3. Read [CHECKPOINT.md](CHECKPOINT.md) for completed work, validation,
   outstanding issues, and the exact next step.
4. Follow links to applicable design and implementation plans.

Current handoff and checkpoint information takes precedence over archived notes.

## Architecture

- Next.js, React, and TypeScript implement chat and dashboard views.
- The AI SDK consumes streamed narrative, tool activity, and structured results.
- Zod validates incoming result and interpretation contracts.
- Deterministic frontend adapters translate retrieved records into NIAGADS
  Table, Charts, and UI components.
- The frontend owns component selection, layout, filters, and presentation.
  The model supplies result references and presentation preferences, not
  component props or rewritten records.

Chat contains brief summaries and dashboard links. Retrieved lists and charts
appear on the dashboard; individual record lookups use summary cards.
Downloads preserve retrieved records and provenance.

## Backend integration

The paired backend lives in `niagads-pylib`.

ASK uses one retrieval agent with optional structured interpretation.
A `data-niagads-plan` event is not required before results can render.
Retrieved records arrive through `data-niagads-result`; model progress uses
`data-niagads-model-status`.

Frontend session state retains conversation and dashboard data during navigation.
It is temporary display state, not authoritative backend evidence.

## Working conventions

- Inspect existing components, adapters, and API contracts before changing them.
- Keep frontend and backend contracts aligned through existing generation and
  validation conventions.
- Preserve native diagnostics and distinguish retrieval failures from
  presentation failures.
- Follow repository instructions for checks and test execution.
- Report static checks, automated tests, browser checks, and live API/model
  validation separately. Simulated protocol tests do not establish live accuracy.

## Maintaining these notes

- `HANDOFF.md`: current scope, architectural decisions, and continuation context.
- `CHECKPOINT.md`: completed changes, checks performed, remaining work,
  and the exact next step.
- `archive/`: superseded handoffs and checkpoints.

Keep current documents concise. Link to or generate plans and historical notes rather than
copying their full contents.  When moving plans or historical handoffs to the `/archive` add
a date stamp prefix to the file name.
