# NIAGADS Open Access API Client

Next.js client for the [NIAGADS Open Access API](https://api.niagads.org). Currently provides the API documentation at `/docs`, rendered from the API's OpenAPI specification using [Scalar](https://github.com/scalar/scalar) (`@scalar/api-reference-react`). `/docs` is one route in the app; the root route `/` is reserved for the rest of the application (e.g., dashboards).

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
