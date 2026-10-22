# NIAGADS Open Access API Client

## Chat and dashboard navigation

Chat uses conversation cards, brief Markdown summaries, record-summary cards and
dashboard links. Lists/charts render at /dashboard/{id}; same-tab navigation back
to chat preserves history and allows follow-ups to append results. Completed
track fetches survive navigation too. Refresh, close or New session clears all
in-memory state; dashboard links are not shareable. Unknown IDs show a notice.

Single gene/variant/track lookups use API summary content and provide a full JSON
link through a fixed /api/record/{entity}/{id} proxy. Download JSON preserves the
retrieved payload/provenance even on presentation failure. Downloads include only
retrieved pages. Markdown renders with raw HTML disabled; data tables are replaced
by a dashboard notice. Brief-answer rules need live model validation.

Install the updated root lockfile and rebuild UI for the native ActionButton prop
typing correction. Protocol v4 is unchanged. See ASK_CHAT_DASHBOARD.md and
ASK_NIAGADS_HANDOFF.md at the repository root for continuation details.

## Compact request interpretation

`data-niagads-plan` is optional and carries a bounded goal, intent, flat concepts,
short constraints, unresolved scope and necessary clarification/evidence hints. Recursive Boolean
plans and tool sequences are no longer required. The backend's existing PydanticAI
loop chooses each next action from returned evidence. Clear lookups retrieve
directly; complex requests may record a typed interpretation within that loop,
including after identifier resolution. No interpretation event is required before
structured results can render. The strict client schema
in `app/ask/planning.ts` matches Python's field/count bounds and generated enums;
deploy both repositories together. Interpretation remains available in feedback;
it is not retrieved evidence. Follow-ups submit only text history.

Dashboard adapters, regional-variant tables (including one-record results), typed
ADSP filters and downloads remain unchanged. No paging UI or additional-page
retrieval is added. Unsupported capabilities remain explicit; metadata is not
substituted for genomic data. Three focused interpretation-contract regressions
pass; these protocol checks do not verify live model interpretation or grounding.

## ASK NIAGADS prototype

The API adapter supports gene, variant, and track identifier lookups and
gene/variant association pages. Variant records use the existing table view.
Gene/track semantic search uses OpenRouter query embeddings in the API layer.
It requires a server-side key and the exact ETL embedding model to be available
through OpenRouter. Live semantic retrieval remains unverified. Variant semantic
search is still planned.

On the Python server, `ASK_MODEL=openrouter/free` lets OpenRouter choose a chat
model per request. Embeddings use the separate `OPENROUTER_EMBEDDING_MODEL`
setting, currently restricted to `liquid/lfm-2.5-embedding-350m:free`.

The root route now hosts a current-session conversation; `/docs` stays available.
It uses `ai`/`@ai-sdk/react` and a fixed server-side `/api/ask` proxy to the existing
FastAPI app. Set **API_INTERNAL_URL** in `.env.local` to that API's base URL. Provider
credentials and Logfire settings belong only on the Python server.

After the root `npm ci`, build the reused workspace components once:

```bash
npx lerna run build --scope=@niagads/table --scope=@niagads/charts --include-dependencies --concurrency=1
```

Run this app's existing development command or `npm run build-app`. New dependency
versions are pinned in the lockfile: AI SDK 7.0.143 and AI SDK React 4.0.147, paired
with the backend's PydanticAI 2.57.0 Vercel adapter (`sdk_version=7`).

For phenotype questions, identify a gene or candidate genes; ASK can inspect the
returned association trait annotations with source/page context. A phenotype-first
request without candidate genes needs scope clarification. See the Python base's
`ASK_NIAGADS.md` for the full handoff.

Chat shows brief streamed summaries and collapsible retrieval progress. The
dashboard shows source IDs, typed evidence tables and optional categorical bars using `@niagads/table` and `@niagads/charts`. Deterministic
adapters convert retrieved records; the agent records coarse presentation intent
and result references. All mappings and UI choices belong to this frontend. Tables use curated field mappings and
categorical/boolean graphical filters. Numeric histogram filters are disabled.
Reported p-value strings are preserved, including scientific notation below
floating-point range; rebuild the workspace Table package before local review.

`category_counts_bar` counts loaded records; `association_counts_bar` displays API
summary counts without recounting. Bars are independent of table filters and label
their data scope. The frontend setting `NEXT_PUBLIC_ASK_MAX_BAR_CATEGORIES` defaults to 7. Larger
sets keep all counts in a table instead of a bar. Raw result records, provenance,
and pagination remain inspectable even without a supported presentation. Only
complete `data-niagads-result` parts render. Model-generated code is never run.

Operation failures are rendered once from validated `issues` in result parts.
Terminal stream failures and pre-stream proxy failures use the same safe issue
contract and show available request references. The proxy maps HTTP status to
controlled messages without forwarding upstream error bodies. Raw SDK parsing
errors are replaced with a safe response message. An empty successful retrieval
is displayed separately from a failure.

History is memory-only. New session/reload clears it; no browser storage,
Valkey, or Cognito persistence is added. Missing/unsupported retrieval is not an
empty successful answer. Database queries, ORM updates, and embedding integration
are deferred to the user's system.

Synthetic-record ASK tests have been removed. Dashboard behavior requires validation
against actual API responses and configured services. TypeScript and lint checks
check source consistency only; they do not establish real-data correctness.

To add a view, register a frontend adapter for an expected API output in
app/ask/translators, following the Charts source-format translator pattern. Local
record adapters own field mappings, runtime row validation, table props, chart
eligibility and transforms. No Python presentation registry or generated UI
mapping is involved. Existing data enums alone remain generated from Python.

The v4 result envelope carries authoritative results and coarse presentation
intent: result_id, view (auto/table/plot), title and optional plot_type/group_by/x/y
hints. Plot types and field hints are open strings, not backend component names.
Python validates intent structure and evidence references. The frontend resolves
views using its adapters: explicit tables stay tables, plots are rendered when a
compatible adapter exists, and unsupported requests receive a notice with raw
records retained. Auto defaults to a supported table. UI changes need no Python
change; API record-schema changes may require an adapter update.

NEXT_PUBLIC_ASK_MAX_BAR_CATEGORIES is a positive integer (default 7). Oversized
categorical sets retain their count table and an explanation. Backend
ASK_MAX_BAR_CATEGORIES is removed. Update both repos together for v4; v3 UI
selection payloads are rejected. Numeric histogram filters remain disabled.
Regional Manhattan, standalone pies and shared panel state remain follow-ups.

Next.js client for the [NIAGADS Open Access API](https://api.niagads.org). Provides API documentation at `/docs`, rendered from the API's OpenAPI specification using [Scalar](https://github.com/scalar/scalar) (`@scalar/api-reference-react`), and the ASK NIAGADS prototype at `/`.

> NOTE: Not a stand-alone microservice. It renders the specification served by the Open Access API, which is an independent application.

## Tech Stack

- **Next.js** (App Router) and **React**, using the versions pinned by the other monorepo apps
- **TypeScript**
- **@scalar/api-reference-react** - renders the OpenAPI specification

## Next.js Local Environment

Copy `sample.env.local` to `.env.local`

```bash
cp sample.env.local .env.local
```

and edit as necessary for your environment:

- **NEXT_PUBLIC_OPENAPI_URL**: URL of the OpenAPI specification to render at `/docs`.
  - sample file default: the public Swagger Petstore (`https://petstore3.swagger.io/api/v3/openapi.json`), used as a build trial
  - production: `https://api.niagads.org/openapi.json`

## Development Deployment

To deploy, without linking hot reloads to the `packages`, run as a standard Next.js app from this directory (`/apps/open-access-api-client`):

```bash
npm run open-access-api-client
```

To link hot reloads to the `packages`, run the script of the same name from the monorepo root, which also starts the watcher:

```bash
cd ../..
npm run open-access-api-client
```

Then open [http://localhost:3000/docs](http://localhost:3000/docs).

## Scalar Configuration

Scalar is configured through the `configuration` prop of `ApiReferenceReact` in `app/docs/page.tsx`. Options that developers should be aware of:

- **url**: the specification to render; read from `NEXT_PUBLIC_OPENAPI_URL`.
- **agent.disabled**: set to `true`. Turns off the Scalar AI agent ("Ask AI") chat, which is a Scalar feature; do not enable it without review.
- **showDeveloperTools**: `'localhost' | 'always' | 'never'`. Not set, so the Scalar default (`'localhost'`) applies: the developer tools are shown only when the page is served from `localhost`, so they appear in local Docker testing but not on a deployed domain. Set to `'never'` to hide them everywhere.
- **showToolbar**: `'localhost' | 'always' | 'never'`. Not set; same default and behavior as `showDeveloperTools`.

The full list of options is defined in `@scalar/types` (`node_modules/@scalar/types/dist/api-reference/`).

## Install Scripts

Scalar depends on `vue-demi`, whose `postinstall` script is allowed in the root `package.json` `allowScripts` (npm ignores `allowScripts` in workspace `package.json` files).


## Track selection actions

ASK track search and track-record tables support selecting up to five tracks and
fetching their data. The button uses the server-side `/api/track-data` proxy, which
calls `/record/track/{track_id}/data` on API_INTERNAL_URL once per selected track, in parallel
and without query parameters. The upstream endpoint is supplied by the merged API development base.

Each action adds an independent association table, preserving requested track IDs,
API-reported source tracks, per-track failures and pagination. Original responses
remain inspectable. No automatic page retrieval, LLM call or chat-history update
is performed. Missing pagination is labelled as unknown completeness. Rebuild the
workspace Table package to enable its new `rowSelectOpts.maxSelectedRows` option;
existing Table consumers retain unlimited selection unless configured.

Track selection and fetched-data rendering require validation with actual track
responses, including pagination and partial failures.
