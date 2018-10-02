'use strict';

import * as bunyan from 'bunyan';
const log = bunyan.createLogger({ name: 'sample-graphql' });
import 'babel-polyfill';
import lambdaPlayground from 'graphql-playground-middleware-lambda';
import { makeExecutableSchema } from 'graphql-tools';
import { graphqlLambda } from 'apollo-server-lambda/dist/lambdaApollo';
import { schema } from './schema';
import { resolvers } from './resolvers';

const myGraphQLSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers,
    logger: console
});

exports.graphqlHandler = function graphqlHandler(event: any, context: any, callback: any) {
    log.info('hit graphql');

    function callbackFilter(error: any, output: any) {
        // eslint-disable-next-line no-param-reassign
        if (output) {
            output.headers['Access-Control-Allow-Origin'] = '*';
            log.info(output.body);
        } else {
            log.error(error);
        }

        callback(error, output);
    }

    const handler = graphqlLambda({ schema: myGraphQLSchema, tracing: true });
    return handler(event, context, callbackFilter);
};

// for local endpointURL is /graphql and for prod it is /stage/graphql
exports.playgroundHandler = lambdaPlayground({
    endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT ? process.env.REACT_APP_GRAPHQL_ENDPOINT : '/production/graphql'
});
