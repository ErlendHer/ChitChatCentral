import * as crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import type { Result } from "@shared/execution";

const { Sha256 } = crypto;

const GRAPHQL_ENDPOINT = process.env.API_CCC_GRAPHQLAPIENDPOINTOUTPUT ?? '';
const AWS_REGION = process.env.AWS_REGION ?? 'eu-north-1';

const signer = new SignatureV4({
  credentials: defaultProvider(),
  region: AWS_REGION,
  service: 'appsync',
  sha256: Sha256,
});

interface GraphQLResponse<T> {
  data: T;
  errors?: unknown[];
}

export async function executeGQLRequest<T extends object, V = undefined>(query: string, variables: T | undefined = undefined): Promise<Result<GraphQLResponse<V>>> {
  try {
    const endpoint = new URL(GRAPHQL_ENDPOINT);
    const requestToSign = getQueryHttpRequest(query, endpoint, variables);

    const signed = await signer.sign(requestToSign);
    const request = new Request(GRAPHQL_ENDPOINT, signed);

    const response = await fetch(request);

    if (response.status !== 200) {
      throw new Error(`Failed to execute GraphQL request: ${response.statusText}`);
    }

    const responseData = (await response.json()) as GraphQLResponse<V>;

    if (responseData.errors) {
      throw new Error(`Failed to execute GraphQL request with error: ${JSON.stringify(responseData.errors)}`);
    }

    return {
      success: true,
      data: responseData
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to execute GraphQL request'
    }
  }
}

function getQueryHttpRequest(query: string, endpoint: URL, variables: object | undefined = undefined) {
  return new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      host: endpoint.host
    },
    hostname: endpoint.host,
    path: endpoint.pathname,
    body: JSON.stringify({ query, ...(variables && { variables }) })
  })
}

export type AWSDateTime = string;
