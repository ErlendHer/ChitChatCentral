import awsServerlessExpress from 'aws-serverless-express';
import { APIGatewayProxyHandler, Context, APIGatewayEvent } from 'aws-lambda';
import { initializeApp } from './app';

/* Amplify Params - DO NOT EDIT
  API_CCC_GRAPHQLAPIENDPOINTOUTPUT
  API_CCC_GRAPHQLAPIIDOUTPUT
  API_CCC_GRAPHQLAPIKEYOUTPUT
  API_CCC_MESSAGETABLE_ARN
  API_CCC_MESSAGETABLE_NAME
  API_CCC_ROOMTABLE_ARN
  API_CCC_ROOMTABLE_NAME
  AUTH_CCC_USERPOOLID
  ENV
  REGION
  STORAGE_S3CCC_BUCKETNAME
Amplify Params - DO NOT EDIT */


const server = awsServerlessExpress.createServer(initializeApp());

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent, context: Context) => {
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
