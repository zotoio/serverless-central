'use strict';

import { Handler, Context, Callback } from 'aws-lambda';
import * as AWS from 'aws-sdk';

interface HelloResponse {
    statusCode: number;
    body: string;
}

const handler: Handler = (event: any, context: Context, callback: Callback) => {
    AWS.config.update({ region: process.env.SLS_AWS_REGION });

    console.log('here');

    const response: HelloResponse = {
        statusCode: 200,
        body: JSON.stringify(event)
    };

    callback(undefined, response);
};

export { handler };
