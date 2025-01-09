# nextjs-template

> template repository for NIAGADS next.js sites

## Usage

You can create an new project in multiple ways:

### Using node/npx to build a new application, not linked to a repository
```bash
npx create-next-app --example https://github.com/NIAGADS/nextjs-template <app>
```

### Generate a new repository in GitHub using the template (CLI)

```bash
gh repo create <new-repo-name> --template="https://github.com/NIAGADS/nextjs-template"
```

### Generate a new repository in GitHub using the template (website)

<https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template>

## To sync templated projects with the template

in the local project directory for the application built from the template

```bash
git remote add template https://github.com/NIAGADS/nextjs-template
git fetch --all
git merge template/[branch to merge] --allow-unrelated-histories
```

# Docker

> NOTE: this template includes a docker-compose.yaml file.  README for building a templated docker application will be added soon.
