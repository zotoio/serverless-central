# sample-authorizer
This function is intended for use with AWS api gateway as a 'REQUEST' type authorizer.  It simply checks that the incoming requests `Authorization` header contains env var `SLS_AUTHORIZER_SHARED_SECRET`. 

Generally a JWT based check would be done instead, or AWS Cognito used.

refer:

https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
