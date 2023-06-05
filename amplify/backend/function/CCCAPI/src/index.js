"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_serverless_express_1 = __importDefault(require("aws-serverless-express"));
const app_1 = require("./app");
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
const server = aws_serverless_express_1.default.createServer((0, app_1.initializeApp)());
const handler = async (event, context) => {
    return aws_serverless_express_1.default.proxy(server, event, context, 'PROMISE').promise;
};
exports.handler = handler;
