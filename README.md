# serverless-central

This is a monorepo of serverless functions built using yeoman.io generator https://github.com/zotoio/generator-mono-serverless

## install
Clone this repo.  And perform setup listed at https://github.com/zotoio/generator-mono-serverless

## structure
All functions are in directories under /packages

Each function has a standalone serverless.yml for independent deployment, while also sharing global libraries and build/test/linting frameworks.

## extending
You can add new function packages by running the yeoman sub-generator:
```
yo mono-serverless:package
```
..and following prompts.  This will give you the scaffolding for a new serverless function.

## deploy
To deploy a given function, go to the `packages/[function]` dir and run: 
```
yarn run sls-deploy
```
This script will assemble inherited env vars, lint, test and compile the Lambda function, and deploy it to AWS.


