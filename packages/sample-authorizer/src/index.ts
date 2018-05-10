'use strict';

import { Handler, Context, Callback } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const handler: Handler = (event: any, context: Context, callback: Callback) => {
    AWS.config.update({ region: process.env.SLS_AWS_REGION });

    console.log(event);
    const sharedSecret = process.env.SLS_AUTHORIZER_SHARED_SECRET;

    if (event.headers && event.headers.Authorization.indexOf(sharedSecret) > -1) {
        console.log(`auth secret OK ${event.headers.Authorization}`);
        callback(null, generatePolicy('user', 'Allow', event.methodArn));
    } else {
        console.log(`auth secret invalid ${event.headers.Authorization}`);
        callback(null, generatePolicy('user', 'Deny', event.methodArn));
    }
};

// Help function to generate an IAM policy
const generatePolicy = (principalId: any, effect: any, resource: any) => {
    const authResponse: any = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument: any = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne: any = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
        stringKey: 'stringval',
        numberKey: 123,
        booleanKey: true
    };

    console.log(JSON.stringify(authResponse));
    return authResponse;
};

export { handler };
