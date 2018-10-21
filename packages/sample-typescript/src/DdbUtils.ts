import * as AWS from 'aws-sdk';

export class DdbUtils {
    private docClient: AWS.DynamoDB.DocumentClient;

    public getDocClient(): AWS.DynamoDB.DocumentClient {
        if (this.docClient) {
            return this.docClient;
        }

        const ddbConfig: AWS.DynamoDB.Types.ClientConfiguration = process.env.IS_OFFLINE
            ? {
                  region: 'localhost',
                  endpoint: 'http://localhost:8000'
              }
            : {};

        const dynamo: AWS.DynamoDB = new AWS.DynamoDB(ddbConfig);

        const ddbDocClientConfig: AWS.DynamoDB.DocumentClient.DocumentClientOptions &
            AWS.DynamoDB.Types.ClientConfiguration = {
            convertEmptyValues: true,
            service: dynamo
        };

        if (process.env.IS_OFFLINE) {
            ddbDocClientConfig['region'] = 'localhost';
            ddbDocClientConfig['endpoint'] = 'http://localhost:8000';
        }

        this.docClient = new AWS.DynamoDB.DocumentClient(ddbDocClientConfig);

        return this.docClient;
    }
}
