import type { AWS } from '@serverless/typescript';
import dynamoDbTables from './resources/dynamodb-tables';

import message from '@functions/message';
import { wsHandler } from '@functions/websocket';

const serverlessConfiguration: AWS = {
  service: 'websocket-lambda',
  frameworkVersion: '3',
  plugins: [
      'serverless-esbuild',
      'serverless-offline',
      'serverless-dynamodb-local',
      'serverless-dotenv-plugin',
  ],
  resources: {
    Resources: dynamoDbTables,
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    stage: 'dev',
    region: 'eu-central-1',
    architecture: 'arm64',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: '${self:custom.region}',
      STAGE: '${self:custom.stage}',
      CONNECTIONS_TABLE: '${self:custom.connections_table}',
    },
  },
  // import the function via paths
  functions: { message, wsHandler },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    region: '${opt:region, self:provider.region}',
    stage: '${opt:stage, self:provider.stage}',
    connections_table: '${self:service}-wsconnections-${opt:stage, self:provider.stage}',
    table_throughputs: {
      prod: 5,
      default: 1,
    },
    table_throughput: '${self:custom.TABLE_THROUGHPUTS.${self:custom.stage}, self:custom.table_throughputs.default}',
    dynamodb: {
      stages: ['dev'],
      start: {
        port: 8000,
        inMemory: true,
        heapInitial: '200m',
        heapMax: '1g',
        migrate: true,
        seed: true,
        convertEmptyValues: true,
        noStart: true
      }
    },
    ['serverless-offline']: {
      httpPort: 3000,
      babelOptions: {
        presets: ["env"]
      }
    }
  },
};

module.exports = serverlessConfiguration;
