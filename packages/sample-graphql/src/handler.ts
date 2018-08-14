'use strict';

import * as bunyan from 'bunyan';
const log = bunyan.createLogger({ name: 'sample-graphql' });
import 'babel-polyfill';
import lambdaPlayground from 'graphql-playground-middleware-lambda';
import { makeExecutableSchema } from 'graphql-tools';
const schema = require('./schema');
const resolvers = require('./resolvers');

const myGraphQLSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers,
    logger: console
});

exports.graphqlHandler = function graphqlHandler(event: any, context: any, callback: any) {
    log.info('hit graphql');

    function callbackFilter(error: any, output: any) {
        // eslint-disable-next-line no-param-reassign
        output.headers['Access-Control-Allow-Origin'] = '*';
        callback(error, output);
    }

    const handler = graphqlLambda({ schema: myGraphQLSchema, tracing: true });
    return handler(event, context, callbackFilter);
};

// for local endpointURL is /graphql and for prod it is /stage/graphql
exports.playgroundHandler = lambdaPlayground({
    endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT ? process.env.REACT_APP_GRAPHQL_ENDPOINT : '/production/graphql'
});

exports.graphiqlHandler = graphiqlLambda({
    endpointURL: process.env.REACT_APP_GRAPHQL_ENDPOINT ? process.env.REACT_APP_GRAPHQL_ENDPOINT : '/production/graphql'
});
