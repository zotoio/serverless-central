'use strict';

import * as AWS from 'aws-sdk';
import { Handler, Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as bunyan from 'bunyan';
import { DdbUtils } from './DdbUtils';

const log = bunyan.createLogger({ name: 'sample-typescript' });
const ddbUtils: DdbUtils = new DdbUtils();

/**
 * query dynamo db table by id
 * /sample-typescript/{id}
 *
 * @param {APIGatewayProxyEvent} event
 * @param {Context} context
 * @returns {Promise<void>}
 */
const handler: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
    log.info(event, context);

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: ''
    };

    if (!event.pathParameters || !event.pathParameters.id) {
        response.body = 'invalid request';
        return response;
    }

    const id = event.pathParameters.id;
    log.info(`processing request for id: ${id}`);

    const docClient = ddbUtils.getDocClient();

    const queryParams: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: process.env.SLS_DYNAMODB_TABLENAME || 'NO_TABLE_DEFINED',
        KeyConditionExpression: '#id = :id',
        ExpressionAttributeNames: {
            '#id': 'id'
        },
        ExpressionAttributeValues: {
            ':id': id
        }
    };

    return docClient
        .query(queryParams)
        .promise()
        .then(
            (data: any) => {
                log.info('Query succeeded.');
                const results: any = [];
                if (data.Items) {
                    data.Items.forEach((item: any) => {
                        log.info(item);
                        results.push(item);
                    });
                }
                response.body = JSON.stringify(results);
                return response;
            },
            (err: any) => {
                response.body = `Unable to query. Error: ${JSON.stringify(err)}`;
                log.info(response.body);
                return response;
            }
        );
};

export { handler };
