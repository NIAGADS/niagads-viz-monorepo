# ASK NIAGADS local Codex handoff

Updated: 2026-10-20. Work is on codex/cloud-environment-setup, based on app/oa-api,
with the latest frontend documentation change at a6cf7519. The paired Python
repository uses the same task branch, based on refactor/api, at c1b1e53c before
the handoff documentation commit. Do not base further work on main.

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

The next task is review and local integration validation, not new feature work.
Live model/database results have not been verified. Preserve local changes and
discuss significant changes before applying them. Follow the Python repository's
explicit-request rule for tests; this handoff does not authorize a test run.

See the [frontend run guide](apps/open-access-api-client/README.md) for setup,
transport contracts and mock browser-review instructions.
