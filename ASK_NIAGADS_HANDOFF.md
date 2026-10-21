# ASK NIAGADS local Codex handoff

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

The UI is apps/open-access-api-client. Its server-side API_INTERNAL_URL points to the
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
