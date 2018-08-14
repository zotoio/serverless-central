'use strict';

import { Handler, Context, Callback } from 'aws-lambda';
import 'source-map-support/register';
import * as bunyan from 'bunyan';
import { ZooData } from './zooData';
import * as protobuf from 'protobufjs';

const log = bunyan.createLogger({ name: 'sample-grpc' });

const handler: Handler = (event: any, context: Context, callback: Callback) => {
    const root = protobuf.loadSync('src/zoo.proto');

    const animals = ZooData.animals();
    log.info(animals);

    const Animals = root.lookupType('zoo.Animals');
    const message = Animals.create(animals);
    const buffer = Animals.encode(message).finish();

    const response = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/x-protobuf' },
        body: protobuf.util.base64.encode(buffer, 0, buffer.length),
        isBase64Encoded: true
    };

    callback(null, response);
};

export { handler };
