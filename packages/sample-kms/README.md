# sample-kms
This aws function demonstrates use of the https://github.com/nordcloud/serverless-kms-secrets plugin to encrypt environment variables with a kms key, package the encrypted values, and decrypt them in lambda..

Take note of aws kms account limits to ensure your use case is suitable.

## prerequisites
1. use a lambda execution role with access to the services you require.
2. create a kms key, and add decrypt rights to your execution role

> Capture the ARN of your execution role, and the uuid of your kms key. You will need these when you run `yarn generate-package`.

When generating a package, enter your lambda execution role and kms key id when promptd.  This will install the required plugin, scripts and templating.

## encrypting an environment variable
Inside your package, run `yarn sls-encrypt <name> <value>` eg. for this sample, you would run:

```
yarn sls-encrypt SLS_CRYPT_DB_PASS supersecr3t
```
> note that kms requires network access to aws to perform this task. 

The above command will create a stage specific file of encrypted vars. (`kms-secrets.<stage>.<region>.yml`) It is safe to commit this file if you choose to.

This means that unencrypted are never sent over the wire, nor visible in the aws console, and are only decrypted at runtime where they are needed.

## decrypting environment variables
Locally, you can use `yarn sls-decrypt <varName>`

Within your lambda code you need to use aws apis to decrypt the env vars at runtime.  A sample helper class `KmsUtils.ts` is available in this repo.  It should be instantiated outside of the handler function.

```
import { KmsUtils } from './KmsUtils';
const kmsUtils = new KmsUtils();
```

This class attempts to decrypt and cache any env vars prefixed with `SLS_CRYPT_*` upon class instantiation.  This happens on lambda at cold start, and then the handlers on a given lambda instance can reuse the cached decrypted values by calling `kmsUtils.decrypt(<env var>)` eg:
 
```
const dbPass = await kmsUtils.decrypt(process.env.SLS_CRYPT_DB_PASS);
```
You can use `yarn sls-logs -f sample-kms` to confirm things are working as expected.

> Don't log the values you have decrypted.

For these types of util classes that will be reusable across multiple Lambdas and repos, it is recommended to create a separate serverless-utils package as a dependency of the generated monorepo.
