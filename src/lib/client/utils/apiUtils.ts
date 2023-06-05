import { API } from "aws-amplify";
import { getIdToken } from "../auth/auth";

export interface ErrorInfo {
  statusCode: number;
  message: string;
  messageWithCode?: string;
}

export type ApiResult<T> =
  {
    success: true,
    data: T,
  } |
  {
    success: false,
    error: ErrorInfo
  }

export interface AmplifyError extends Error {
  response: {
    status: number;
    statusText: string;
    data?: {
      error?: {
        message?: string;
      }
      message: string;
    }
  }

}

export interface ApiBodyType {
  body: unknown;
  headers: Record<string, string>;
}

function getErrorInfo<T>(err: unknown): ApiResult<T> {
  const amplifyError = (err) as AmplifyError;
  const responseError = amplifyError.response;

  const message = responseError.data?.error?.message ?? responseError.data?.message ?? amplifyError.message ?? responseError.statusText;
  const messageWithCode = `${message} (${responseError.status})`

  return {
    success: false,
    error: {
      statusCode: responseError.status,
      message,
      messageWithCode
    }
  }
}

const getAuthHeader = async (): Promise<Record<string, string>> => {
  return { Authorization: `${await getIdToken()}` }
}

export const cccApiGET = async <T>(path: string, params?: Record<string, string>): Promise<ApiResult<T>> => {
  try {
    const response = await API.get('cccapi', path, { queryStringParameters: params, headers: { ...(await getAuthHeader()) } });
    return {
      success: true,
      data: response as T
    }
  } catch (error) {
    return getErrorInfo<T>(error);
  }
}

export const cccApiPOST = async <T>(path: string, body?: unknown, params?: Record<string, string>): Promise<ApiResult<T>> => {
  try {
    const response = await API.post('cccapi', path, { body, queryStringParameters: params, headers: { ...(await getAuthHeader()) } });
    return {
      success: true,
      data: response as T
    }
  } catch (error) {
    return getErrorInfo<T>(error);
  }
}