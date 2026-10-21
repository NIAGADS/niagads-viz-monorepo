# ASK NIAGADS local Codex handoff

## Active task: dashboard translators

Work is on **codex/ask-dashboard-translators** in both repositories, based on
Python **refactor/api at ef6d2ba1** and frontend **app/oa-api at c3962e5f**.
The separate codex/ask-structured-query-planning branches are preserved. Their
planning implementation is not included in these bases and was not modified.

The user approved the contract proposal in
`developer-notes/plans/ask/dashboard-translators.md`. ASK now uses envelope version
3: presentations select a registered translator, result_id and typed parameters.
Deploy/update the paired backend and client together; version-2 selections are
not silently reinterpreted. Server-owned rows/provenance/pagination are retained.

Registered tables cover search matches, gene/variant/track records, associations
and association counts. Python advertises/validates compatible selections and
exports mapping rules; deterministic TypeScript translators construct table/bar
props. The agent neither rewrites records nor computes aggregates. Unknown nested
structures remain in raw records. Results without a compatible panel also retain
their raw records and provenance in the UI.

Categorical/boolean table filters reuse existing controls. Numeric/p-value column
filters are disabled because histogram filters are excluded. Reported scientific
p-value strings are preserved without numeric underflow; censored/nondecimal
strings remain displayed with p-value sorting disabled for that dataset. Decimal
p-value sorting is implemented without floating-point conversion. The separate
negative-log10 field remains numeric.

Standalone bars are independent of table filters. category_counts_bar counts
loaded rows by a registered scalar field; association_counts_bar displays API
num_associations without recounting. Scope labels and completeness warnings remain
visible. ASK_MAX_BAR_CATEGORIES defaults to 7; larger sets keep all counts in the
table without truncation or fabricated Other categories. Table filters retain
their existing category policy. No standalone pies or shared panel state.

Verification: app TypeScript/targeted ESLint and Pydantic v3 JSON schema generation
passed. Table source TypeScript passed with --ignoreDeprecations 5.0 overriding an
existing config value unsupported by the installed compiler. Final checks and
independent review are recorded in the task plan. Test cases were added/updated
but not executed under AGENTS.md; no live model/database requests were made.
Rebuild the workspace Table package before local UI review to pick up p-value
preservation changes. Retrieval, SQL/ORM/ETL and embedding behavior are unchanged.

Next: local integration review. Deferred: table histogram repair, regional
Manhattan with position/-log10(p) and disease/population grouping, cross-panel
filtering. Resume from these branches, not main or the historical branches below.

## Merged prototype checkpoint (historical)

Updated: 2026-10-20. Work is on codex/cloud-environment-setup, based on app/oa-api,
with the latest implementation commit c796e7e8. The paired Python repository uses
the same task branch, based on refactor/api, at c613ea3c. The merge conflicts are
resolved; both implementation checkouts were clean before these handoff edits.
Do not base further work on main. These commit IDs precede this checkpoint update.

Read the [full task handoff in niagads-pylib](https://github.com/NIAGADS/niagads-pylib/blob/codex/cloud-environment-setup/ASK_NIAGADS_HANDOFF.md)
and each repository's AGENTS.md before continuing. That handoff records the
current implementation, user decisions, validation limits, deferred work and a
suggested prompt for local continuation. If both repositories are checked out
beside each other, the file is ../niagads-pylib/ASK_NIAGADS_HANDOFF.md.

The UI is apps/open-access-api-client. Its server-side ASK_API_URL points to the
Python API; OpenRouter credentials and model settings belong on the Python
server. Chat can use ASK_MODEL=openrouter/free. Embeddings have their own
OPENROUTER_EMBEDDING_MODEL setting, currently restricted to
liquid/lfm-2.5-embedding-350m:free. Catalog discovery stays off.

Error handling now has two boundaries: setup errors use the existing FastAPI
runtime handler with actual diagnostics; errors after streaming begins use SDK
error events with the original message and request reference. Python custom
exception wrappers, classification registries, and request-local exception
capture were removed. The proxy forwards upstream error responses, and the
browser retains FastAPI detail and plain stream messages. Logfire configuration
and diagnostic logging remain, per the user's explicit decision.

The Python operation registry owns endpoint/entity/annotation/response-model
mapping. Tools select registered operations; gene/track semantic search derives
its mapping from SearchMatch registry entries. SearchMatch's Python field is
`matched_record_id`, but its serialized JSON identifier is `id`; the adapter now
uses that serialized contract. Association full/summary content comes from the
selected registry entry. The frontend uses exported shared entity/annotation/
content values and an explicit presentation registry; it does not infer entity
or operation types from model-generated records.
Natural-language API routes use `/query` with the parameter `text`, for example
`/query/tracks?text=Alzheimer+disease`. The ASK search tool and backend query
service use `text` consistently. `/search` is reserved in the design for
structured/exact retrieval; this rename did not add a `/search` route.

Outstanding: the API client still truncates to 50 rows, and contracts/preview
limits remain. The user's concern about these limits is unresolved. The returned
embedding model-name equality check was removed, with no hardcoded alias added.
Provider-side vector normalization remains unverified. See the Python handoff
and validation/defaults inventory for the remaining review items.

Focused frontend ESLint and TypeScript checks on the changed error/proxy files
passed. Full app typechecking was blocked by missing installed `ai`,
`@ai-sdk/react`, and `@scalar/api-reference-react` dependencies and resulting type
errors. Updated tests were not run. No end-to-end success or Logfire export is
claimed. The missing dependencies remain a local setup item for app validation.

The next task is review and local integration validation, not new feature work.
Live model/database results have not been verified. Preserve local changes and
discuss significant changes before applying them. Follow the Python repository's
explicit-request rule for tests; this handoff does not authorize a test run.

See the [frontend run guide](apps/open-access-api-client/README.md) for setup,
transport contracts and mock browser-review instructions.
