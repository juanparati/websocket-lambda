# Serverless - AWS Websocket Lambda boilerplate with NodeJS and Typescript

This project has been initially generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

This boilerplate will work a simple chat application that uses websockets.


## Test this service

Run dynamodb-local:

    docker run --rm -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -inMemory -sharedDb

Run migration:

    npm run migrate

Run offline server

    npm run offline

Test with wscat:

    wscat -c ws://localhost:3001 

