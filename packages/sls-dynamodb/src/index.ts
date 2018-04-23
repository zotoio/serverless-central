'use strict';

import { Handler, Context, Callback } from 'aws-lambda';

interface HelloResponse {
    statusCode: number;
    body: string;
}

const handler: Handler = (event: any, context: Context, callback: Callback) => {
    const response: HelloResponse = {
        statusCode: 200,
        body: JSON.stringify(event)
    };

    callback(undefined, response);
};

export { handler }
