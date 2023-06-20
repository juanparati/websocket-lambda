import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as AWS from 'aws-sdk';
import { getAllConnections, sendMessage } from './broadcast';
import schema from './schema';
import config from "@libs/env-config";
import middy from "@middy/core";

AWS.config.update(config);

const dynamodb = new AWS.DynamoDB.DocumentClient();

const connectionTable = process.env.CONNECTIONS_TABLE;

const websocketHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log(event);
    const { body, requestContext: { connectionId, routeKey }} = event;
    console.log(body, routeKey, connectionId);

    switch (routeKey) {
        case '$connect':

            await dynamodb.put({
                TableName: connectionTable,
                Item: {
                    connectionId,
                    // Expire the connection an hour later. This is optional, but recommended.
                    // You will have to decide how often to time out and/or refresh the ttl.
                    ttl: parseInt((Date.now() / 1000).toString() + 3600)
                }
            }).promise();

            break;

        case '$disconnect':
            await dynamodb.delete({
                TableName: connectionTable,
                Key: { connectionId }
            }).promise();
            break;

        case '$default':
        default:
            console.log('--> foo');
            const connections = await getAllConnections();
            await Promise.all(
                connections.map(connectionId => sendMessage(connectionId, body))
            );
            break;
    }

    return formatJSONResponse({ statusCode: 200 });
}

// export const wsHandler = middyfy(websocketHandler);

export const wsHandler = middy(websocketHandler);

