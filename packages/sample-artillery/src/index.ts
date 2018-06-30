'use strict';

import { Handler, Context, Callback } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as bunyan from 'bunyan';
const log = bunyan.createLogger({ name: 'sample-artillery' });

interface ApiResponse {
    statusCode: number;
    body: string;
}

const handler: Handler = (event: any, context: Context, callback: Callback) => {
    AWS.config.update({ region: process.env.SLS_AWS_REGION });

    const response: ApiResponse = {
        statusCode: 200,
        body: JSON.stringify(event)
    };

    log.info('use log.info/warn/error/debug, and view cloudwatch logs');

    callback(undefined, response);
};

export { handler };
