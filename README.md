# Nexys Backend Typescript Boilerplate

[![Test](https://github.com/nexys-system/server-boilerplate/actions/workflows/test.yml/badge.svg)](https://github.com/nexys-system/server-boilerplate/actions/workflows/test.yml)
[![Docker](https://github.com/nexys-system/server-boilerplate/actions/workflows/publish.yml/badge.svg)](https://github.com/nexys-system/server-boilerplate/actions/workflows/publish.yml)

This repo generates a fully working node server (typescript).

It is based on [![NPM package](https://badge.fury.io/js/%40nexys%2Fcore.svg)](https://www.npmjs.com/package/@nexys/core) and most configurations can be managed at [nexys.io](https://app.nexys.io).

## Get started

click on _use this template_, clone your repo locally and

```
# install dependencies
yarn
# watch - will run on port 3000 and reload after changes are applied
yarn watch
```

Note: that the CI Node version is set to 17.If your build fails locally try to change your node version to the one used in the CI.

### Sync with Nexys.io

#### Get the Environment Variables

```
yarn getEnvVar
```

You will then be prompted for a token. You can generate the token in the nexys.io platform on top the of the env var panel (in the service of interest)

A `.env` file will be generated with the environment variables. Note that if you are using a database, you need to tick the option when configuring the service and the database env var will be added automatically.

#### Get the Assets

```
yarn getAssets
```

This will fetch the data model, the submodels, roles, option sets, api requests, and workflows.

Note: this command can only be run if you have the environment variables and an `APP-TOKEN`.

## GraphQL

You can query the database using [GraphQL](https://graphql.org/). The URLs are
* `host/graphql/query` for querying
* `host/graphql/schema` for the schema

Don't forget to add the `APP-TOKEN` (look in your `.env` file) in the headers: `Authorization: Bearer APP-TOKEN`

## Deployment

A docker is generated upon new version creation, see https://github.com/nexys-system/server-boilerplate/releases

## CI

every push goes through CI and can be monitored [here](https://github.com/nexys-system/server-boilerplate/actions)
