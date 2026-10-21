# ASK frontend presentation adapters

Current protocol: v4. The user rejected Python-owned UI mappings.

Python returns authoritative datasets/provenance/pagination and presentation
intent (auto/table/plot with optional plot/field hints), validating only structure
and run-local result references. There is no Python UI registry or chart policy.

Frontend source-format adapters under app/ask/translators own table columns,
filters, chart transforms/eligibility, selection actions and layout. Explicit
requests are honored or explained; raw records remain available. Display changes
do not require Python changes or regenerating Python exports. Data enums alone
remain shared. NEXT_PUBLIC_ASK_MAX_BAR_CATEGORIES defaults to 7 in the frontend.

See ASK_NIAGADS_HANDOFF.md and the Python plan
[frontend-presentation-adapters.md](https://github.com/NIAGADS/niagads-pylib/blob/codex/ask-dashboard-translators/developer-notes/plans/ask/frontend-presentation-adapters.md)
for continuation and validation. Existing dashboard branches are retained;
query-planning branches remain independent.
