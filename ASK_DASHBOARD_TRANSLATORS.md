# ASK dashboard translators

Status: contract proposal awaiting review; no product code changes yet.

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
Category limit and schema changes remain proposals pending user review.

Next step: review the canonical proposal before implementing product code.
