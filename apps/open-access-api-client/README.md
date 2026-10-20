# NIAGADS Open Access API Client

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
FastAPI app. Set **ASK_API_URL** in `.env.local` to that API's base URL. Provider
credentials and Logfire settings belong only on the Python server.

After the root `npm ci`, build the reused workspace components once:

```bash
npx lerna run build --scope=@niagads/table --scope=@niagads/charts --include-dependencies --concurrency=1
```

Run this app's existing development command or `npm run build-app`. New dependency
versions are pinned in the lockfile: AI SDK 7.0.143 and AI SDK React 4.0.147, paired
with the backend's PydanticAI 2.57.0 Vercel adapter (`sdk_version=7`).

For a database-free cloud smoke run, start the Python repository's test-only
`test/bases/niagads/open_access_api/ask/serve_prototype.py`, then run:

```bash
ASK_API_URL=http://127.0.0.1:8010 npm run open-access-api-client
```

This harness uses synthetic records and a fake model, not real NIAGADS answers.
Try `Show a dashboard for the test gene`, `Find the test transcript associations`,
or `Find genes for the test phenotype`. The latter two expose pending retrieval
capabilities honestly. See the Python base's `ASK_NIAGADS.md` for the full handoff.

The UI shows streamed text/tool progress, source IDs, validated evidence tables,
and an optional source-summary chart. Table and chart adapters reuse
`@niagads/table` and `@niagads/charts`; raw records remain available if a component
cannot load. Chart counts describe evidence in the retrieved page. Only complete
`data-niagads-result` parts are rendered. Source metadata is displayed as text;
model-generated HTML, code, and arbitrary links are never executed.

History is memory-only. New session/reload clears it; no browser storage,
Valkey, or Cognito persistence is added. Missing/unsupported retrieval is not an
empty successful answer. Database queries, ORM updates, and embedding integration
are deferred to the user's system.

Focused frontend tests (from this app's directory):

```bash
node --experimental-strip-types --test tests/ask.test.ts
npx tsc --noEmit
```

To register another component, extend the backend Presentation model/result-kind
validation, mirror that discriminator in `app/ask/contracts.ts`, and add an adapter
to the registry in `app/ask/Results.tsx`. Add contract/rendering tests and retain
accessible data alternatives. See the Python documentation for the envelope.

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
