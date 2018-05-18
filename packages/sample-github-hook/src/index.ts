'use strict';

import { Handler, Context, Callback } from 'aws-lambda';
import 'source-map-support/register';

interface Response {
    statusCode: number;
    body: string;
}

const handler: Handler = (event: any, context: Context, callback: Callback) => {
    const payload = JSON.parse(event.body);

    const modified: any = [];
    try {
        payload.commits.forEach((commit: object) => {
            ['added', 'removed', 'modified'].forEach((changeType: string) => {
                commit[changeType].forEach((path: string) => {
                    if (!modified.includes(path)) {
                        modified.push(path);
                    }
                });
            });
        });
    } catch (e) {
        console.log(e);
    }

    const response: Response = {
        statusCode: 200,
        body: JSON.stringify(modified)
    };

    console.log(modified);
    callback(undefined, response);
};

export { handler };
