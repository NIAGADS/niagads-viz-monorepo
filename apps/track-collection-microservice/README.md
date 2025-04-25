# NIAGADS Track Collection Microservice

Data Explorer for collections of data tracks hosted in the NIAGADS Alzheimer's GenomicsDB (GWAS Summary Statistics, xQTL Gene Summaries) or Functional Genomics Repository (FILER).

> **Under development; not recommended for third-party use at this time.**

## Dependencies

* Docker

## Developer Notes

This is a templated site based on the [NIAGADS next.js template](https://github.com/NIAGADS/nextjs-template).  Please see that project documentation for instructions on how to keep the *Track Collection Microservice* in sync with the template.  This project also depends on the [NIAGAD Visualization Collection](https://github.com/NIAGADS/niagads-viz-monorepo), using both the [@niagads/ui](https://www.npmjs.com/package/@niagads/ui) and [@niagads/table](https://www.npmjs.com/package/@niagads/table) component libraries.

## Deployment

This is just a basic next.js application, so follow standard procedure.

In the project directory: 
* `npm run build` generates optimized version for production w/stricter linting
* `npm run dev` runs a development build, generated with turbopack
* `npm run start` or `npm run prod` runs the production build
* `npm run lint` to lint the code

### Docker

This template includes a docker-compose.yaml file. The docker build is 2-stage that creates a slim runner application linked to code on the host.  This allows easy editing of the code w/hot-reloads in development environments.  

A Docker deployment requires several environmental variables to be set in an `.env` file.  Copy the sample file:

```bash
cp docker.env.sample .env
```

and edit the following variables as appropriate:

* properties for naming the container and image:
  * `VERSION`
  * `CONTAINER_NAME`
* `BUILD` set to `prod` or `dev` 
* `NETWORK` name of the docker network for the application
* `PORT` mapped port on the host
* `GIT_DEPENDENCIES` set to `1` if your `package.json` imports packages from GitHub
* `APPLICATION_DIR` full path to the application root directory on the host; e.g. `/projects/nextjs-template`

Make sure there is a placeholder `.env.local` file if not required by your application:

```bash
cp sample.env.local .env.local
```

> *IMPORTANT*: the docker build requires the `.env.local` environmental file for the `next.js` application.  If your application does not require any environmental settings you must create the placeholder file.  

To deploy, run the following:

```bash
docker-compose up -d
```

