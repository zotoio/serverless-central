# sample-secure
This function demonstrates the use of a custom authorizer api gateway function.  The serverless.yml contains a reference to the arn of a pre-deployed lambda function, that operates on the incoming request to decide whether the request should be passed on to the target Lambda function, or denied access.

In this case, the `sample-authorizer` in this repo can be deployed and the function arn captured, and added to .env file as SLS_AUTHORIZER_ARN
 
refer to section on custom authorizers referenced by arn:

https://serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoints-with-custom-authorizers

This is the section from serverless.yml that binds the authorizer to the api gateway for the current lambda.  This ARN would likely be used globally in a given account.

```yaml
events:
  - http:
      path: sample-secure
      method: get
      authorizer:
        type: request
        arn: ${env:SLS_AUTHORIZER_ARN}
```
