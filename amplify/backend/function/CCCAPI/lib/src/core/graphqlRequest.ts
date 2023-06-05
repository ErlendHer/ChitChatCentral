import type { Result } from "@shared/execution";

const GRAPHQL_ENDPOINT = process.env.API_CCC_GRAPHQLAPIENDPOINTOUTPUT ?? '';
const GRAPHQL_APIKEY = process.env.API_CCC_GRAPHQLAPIKEYOUTPUT ?? '';

interface GraphQLResponse<T> {
  data: T;
  errors?: unknown[];
}

export async function executeGQLRequest<T extends object>(query: string, variables: T | undefined = undefined): Promise<Result<unknown>> {
  try {
    const request = new Request(GRAPHQL_ENDPOINT, getQueryBody(query, variables));
    const response = await fetch(request);

    if (response.status !== 200) {
      throw new Error(`Failed to execute GraphQL request: ${response.statusText}`);
    }

    const responseData = (await response.json()) as GraphQLResponse<T>;

    if (responseData.errors) {
      throw new Error(`Failed to execute GraphQL request with error: ${JSON.stringify(responseData.errors)}`);
    }

    return {
      success: true,
      data: responseData.data
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to execute GraphQL request'
    }
  }
}

function getQueryBody(query: string, variables: object | undefined = undefined) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': GRAPHQL_APIKEY
    },
    body: JSON.stringify({ query, ...(variables && { variables }) })
  }
}


