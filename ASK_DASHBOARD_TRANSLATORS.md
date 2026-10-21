# ASK dashboard translators

Status: contract proposal approved; implementation complete with static checks and independent review.

This branch is codex/ask-dashboard-translators, based on app/oa-api at c3962e5f.
The paired Python branch has the same name, based on refactor/api at ef6d2ba1.
The separate structured-query-planning branches are preserved.

Canonical proposal: [dashboard-translators.md](https://github.com/NIAGADS/niagads-pylib/blob/codex/ask-dashboard-translators/developer-notes/plans/ask/dashboard-translators.md).
Locally: ../niagads-pylib/developer-notes/plans/ask/dashboard-translators.md.

Scope: deterministic TypeScript translators selected by the agent, typed tables
with existing categorical graphical filters, independent categorical bars.
Histogram filters are explicitly excluded; numeric columns retain numeric types
with column filtering disabled. No standalone pies or cross-panel filtering.

Proposed contract: registered translator + result_id + supported parameters,
with a coordinated envelope version 3. No LLM-generated transformed data.
The user approved the v3 contract and configurable seven-category bar policy.

See ASK_NIAGADS_HANDOFF.md for implementation behavior, validation and continuation instructions.

Track selection follow-up: implemented optional Table maxSelectedRows, ASK's five
track selection limit, and a fixed-path proxy action appending an association
table. Per-track failures, pagination, raw responses and requested/reported track
IDs are preserved. See the current handoff for verification and continuation.
