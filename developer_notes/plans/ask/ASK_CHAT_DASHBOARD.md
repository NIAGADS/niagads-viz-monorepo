# ASK chat and temporary dashboards

Work is on codex/ask-chat-dashboard-navigation, from app/oa-api. The paired
Python branch has the same name and starts from refactor/api.

Chat uses conversation Cards, brief Markdown summaries and single-record summary
Cards. Lists/charts render at /dashboard/{id}. The root AskSessionProvider keeps
chat, draft, generated dashboard ID and completed track fetches in memory across
same-tab navigation. Follow-ups retrieve fresh evidence and append panels.
Refresh, close or New session clears state; unavailable IDs show a notice.
No browser storage, user cache or backend session persistence is introduced.

ASK gene/variant/track lookups request existing API summary models/content. Their
Cards offer a fixed /api/record/{entity}/{id} full-JSON link using API_INTERNAL_URL.
Single-record reports stay Cards; search/association lists stay dashboard results.
Raw retrieved records/provenance and Download JSON remain outside adapter error
boundaries. Downloads contain retrieved pages, not complete database results.

The v4 contract, frontend-owned adapters, feedback, planning, scientific values,
max-five track selection and text-only model history are preserved. Markdown
uses react-markdown 10.1.0 and remark-gfm 4.0.1 with raw HTML disabled; inline
data tables show a dashboard notice. Agent instructions require brief responses
and prohibit record dumps or invented UI links; live compliance is unvalidated.

Install dependencies from the root lockfile and rebuild UI. An existing
ActionButton prop declaration was corrected to ButtonHTMLAttributes so disabled
feedback controls type-check. UI bundle builds with inherited deprecated-file
and declaration-alias warnings. No synthetic tests were added or run; no live
database/model calls were made. Static checks do not establish live correctness.

Canonical plan and progress in niagads-pylib:
developer-notes/plans/ask/chat-dashboard-navigation.md.

Verification: full frontend TypeScript and targeted ESLint passed. Chromium
replayed the user's actual captured stream: two chat Cards, no chat table, a
dashboard Table with ten tracks, a five-track selection cap and retained chat/ID
on return navigation. Downloaded JSON equals the captured retrieved result.
The replay exposed and fixed JSON-looking matched_text being interpreted by Table
as cell configuration; translators now pass explicit string cell values.
No synthetic fixtures, test suites or live model/database calls were used.
Single-record/full-record flows and live response brevity need local validation.
