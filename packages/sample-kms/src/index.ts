'use strict';

import { Handler, Context, Callback } from 'aws-lambda';
import * as assert from 'assert';
import * as AWS from 'aws-sdk';
import { KmsUtils } from './KmsUtils';
import * as bunyan from 'bunyan';
const log = bunyan.createLogger({ name: 'sample-kms' });
const kmsUtils = new KmsUtils();

interface Response {
    statusCode: number;
    body: string;
}

/**
 * this sample handler inserts current request headers to ddb, and also queries for any items with passed in id
 * /gtt/{id}
 *
 * @param event
 * @param {Context} context
 * @param {Callback} callback
 * @returns {Promise<void>}
 */

const handler: Handler = async (event: any, context: Context, callback: Callback) => {
    const id = event.pathParameters.id;
    log.info(`processing request for id: ${id}`);

    const docClient = await getDocClient();
    const test = await kmsUtils.decrypt(process.env.SLS_CRYPT_DB_PASS);
    assert(test, 'test decryption failed');
    log.info(`test kms value has been decrypted. Don't log it!`);

    const response: Response = {
        statusCode: 200,
        body: ''
    };

    const putParams = {
        TableName: 'gttdb',
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
                log.info(`PutItem succeeded:  ${event.requestContext.requestId}`);
            },
            (err: any) => {
                log.info(`Unable to Put item. Error: ${JSON.stringify(err)}`);
            }
        );

    const queryParams = {
        TableName: 'gttdb',
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
            },
            (err: any) => {
                response.body = `Unable to query. Error: ${JSON.stringify(err)}`;
                log.info(response.body);
            }
        );

    callback(undefined, response);
};

const getDocClient: any = async () => {
    const ddbConfig = process.env.IS_OFFLINE
        ? {
              region: 'localhost',
              endpoint: 'http://localhost:8000'
          }
        : {};

    const dynamo = new AWS.DynamoDB(ddbConfig);

    const ddbDocClientConfig = {
        convertEmptyValues: true,
        service: dynamo
    };

    if (process.env.IS_OFFLINE) {
        ddbDocClientConfig['region'] = 'localhost';
        ddbDocClientConfig['endpoint'] = 'http://localhost:8000';
    }

    return new AWS.DynamoDB.DocumentClient(ddbDocClientConfig);
};

export { handler };
