'use strict';

import { Handler, Context, Callback } from 'aws-lambda';
import * as AWS from 'aws-sdk';

interface Response {
    statusCode: number;
    body: string;
}

const handler: Handler = async (event: any, context: Context, callback: Callback) => {
    AWS.config.update({ region: process.env.SLS_AWS_REGION });

    const id = event.pathParameters.id;
    console.log(`processing request for id: ${id}`);

    const dynamo = new AWS.DynamoDB();
    const docClient = new AWS.DynamoDB.DocumentClient({
        convertEmptyValues: true,
        service: dynamo
    });

    const response: Response = {
        statusCode: 200,
        body: ''
    };

    const putParams = {
        TableName: 'slsSampleDynamo',
        Item: {
            id: event.requestContext.requestId,
            data: event.headers
        }
    };

    await docClient
        .put(putParams)
        .promise()
        .then(
            () => {
                console.log(`PutItem succeeded:  ${event.requestContext.requestId}`);
            },
            err => {
                console.log(`Unable to Put item. Error: ${JSON.stringify(err)}`);
            }
        );

    const queryParams = {
        TableName: 'slsSampleDynamo',
        KeyConditionExpression: '#id = :id',
        ExpressionAttributeNames: {
            '#id': 'id'
        },
        ExpressionAttributeValues: {
            ':id': id
        }
    };

    await docClient
        .query(queryParams)
        .promise()
        .then(
            data => {
                console.log('Query succeeded.');
                const results: any = [];
                if (data.Items) {
                    data.Items.forEach(item => {
                        console.log(item);
                        results.push(item);
                    });
                }
                response.body = JSON.stringify(results);
            },
            err => {
                response.body = `Unable to query. Error: ${JSON.stringify(err)}`;
                console.error(response.body);
            }
        );

    callback(undefined, response);
};

export { handler };
