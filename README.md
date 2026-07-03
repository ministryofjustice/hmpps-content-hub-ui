# hmpps-content-hub-ui

[![Ministry of Justice Repository Compliance Badge](https://github-community.service.justice.gov.uk/repository-standards/api/hmpps-content-hub-ui/badge?style=flat)](https://github-community.service.justice.gov.uk/repository-standards/hmpps-content-hub-ui)
[![Docker Repository on ghcr](https://img.shields.io/badge/ghcr.io-repository-2496ED.svg?logo=docker)](https://ghcr.io/ministryofjustice/hmpps-content-hub-ui)

This is the UI for the Content Hub, intended as a replacement for the existing non-TypeScript Content Hub front end (prisoner-content-hub-frontend).

The same UI is used for both Staff and Prisoners.

# Instructions

### Auth Code flows

These are used to allow authenticated users to access the application. After the user is redirected from auth back to
the application, the application will use the returned auth code to request a JWT token for that user containing the
user's roles. The JWT token will be verified and then stored in the user's session.

Different authentication flows are used for staff and prisoners. Prisoners authenticate via Launchpad Auth, whilst staff
authenticate via HMPPS Auth.

The application defaults to using prisoner authentication, and changes to staff authentication by the presence of a
'staff' subdomain. For instance, when running locally, using the hostname localhost:3000 will use prisoner
authentication, and using the hostname staff.localhost will use staff authentication.

These credentials are configured using the following env variables:

- AUTH_CODE_CLIENT_ID
- AUTH_CODE_CLIENT_SECRET
- LAUNCHPAD_API_CLIENT_ID
- LAUNCHPAD_API_CLIENT_SECRET

### Client Credentials flow

These are used by the application to request tokens to make calls to APIs. These are system accounts that will have
their own sets of roles.

Most API calls that occur as part of the request/response cycle will be on behalf of a user.
To make a call on behalf of a user, a username should be passed when requesting a system token. The username will then
become part of the JWT and can be used downstream for auditing purposes.

These tokens are cached until expiration.

These credentials are configured using the following env variables:

- CLIENT_CREDS_CLIENT_ID
- CLIENT_CREDS_CLIENT_SECRET

When running locally, all the client IDs and secrets should be retrieved from k8s secrets in the dev environment.
The easiest way to retrieve these is to use the [Cloud Platform CLI tool](https://user-guide.cloud-platform.service.justice.gov.uk/documentation/getting-started/cloud-platform-cli.html),
for example:

`cloud-platform decode-secret -n prisoner-content-hub-development  -s hmpps-content-hub-ui-client-creds`

### Dependencies

### Redis

The Content Hub UI caches session information and responses to JSON:API requests to the Drupal backend. In Cloud
Platform environments, Redis/Elasticache is used for this purpose.

If Redis is not available, the application will fall back to using a local in-memory cache.

Therefore, it is not required to run Redis locally unless you need a more persistent cache, or you are specifically
testing Redis functionality.

Redis can be installed via brew

```
brew update && brew install redis
brew services start redis
```

Set the environment variable REDIS_ENABLED=true to set the Content Hub UI to cache using Redis rather than the in-memory
cache.

The docker compose file does not currently support running Redis via Docker.

### Running the app for development

Create an environment file by copying `.env.example` -> `.env`

Set the values in .env as detailed in the above sections.

Environment variables set in here will be available when running `start:dev`

Install dependencies using `npm run setup`, ensuring you are using `node v24`

Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder
to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json`
and the github pipeline build config.

And then, to build the assets and start the app with esbuild:

`npm run start:dev`

### Installing dependencies

By default no pre or post install scripts will be run during `npm install`.
Instead a list of configured install scripts will be run via the [npm script allowlist](https://github.com/ministryofjustice/hmpps-typescript-lib/tree/main/packages/npm-script-allowlist) tool.

Instead of running `npm install`, run `npm run setup` - this will run an `npm ci` to install any dependencies and then run any configured install scripts.

### Making changes

The [hmpps precommit hooks library](https://github.com/ministryofjustice/hmpps-typescript-lib/tree/main/packages/precommit-hooks) will ensure that [prek](https://prek.j178.dev/cli/) is installed and initialised against the repo as part of `npm run setup`.

This will run a set of precommit hooks before every commit as configured in `.pre-commit-config.yaml`.
This will scan for potential secrets in the staged files and fail the commit if any are detected.

There's some guidance for dealing with false positives in the [precommit hooks docs](https://github.com/ministryofjustice/hmpps-typescript-lib/tree/main/packages/precommit-hooks#dealing-with-false-positives).

The secret scanner hook can also be configured as described [here](https://github.com/ministryofjustice/devsecops-hooks?tab=readme-ov-file#-configuration).

### Run linter

- `npm run lint` runs `eslint`.
- `npm run typecheck` runs the TypeScript compiler `tsc`.

### Run unit tests

`npm run test`

### Running integration tests

For local running, start a wiremock instance by:

`docker compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with auto-restart on changes)

After first install ensure playwright is initialised:

`npm run int-test-init:ci`

And then either, run tests in headless mode with:

`npm run int-test`

Or run tests with the UI:

`npm run int-test-ui`

## Keeping your app up-to-date

While there are multiple ways to keep your project up-to-date this [method](https://mojdt.slack.com/archives/C69NWE339/p1694009011413449) doesn't require you to keep cherry picking the changes, however if that works for you there is no reason to stop.

In your service, add the template as a remote:

`git remote add template https://github.com/ministryofjustice/hmpps-template-typescript`

Create a branch and switch to it, eg:

`git checkout -b template-changes-2309`

Fetch all remotes:

`git fetch --all`

Merge the changes from the template into your service source:

`git merge template/main --allow-unrelated-histories`

You'll need to manually handle the merge of the changes, but if you do it early, carefully, and regularly, it won't be too much of a hassle.

## Change log

A changelog for the service is available [here](./CHANGELOG.md)
