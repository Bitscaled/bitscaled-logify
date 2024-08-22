/**
 * API Error Handling Utilities
 *
 * This module provides comprehensive error handling utilities specifically for API requests in a Next.js 14.2.5 application.
 * It integrates with existing logging utilities to ensure no duplicate logging occurs.
 *
 * @module apiErrorUtils
 * @file utils/apiErrorUtils.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { logError } from './loggingUtils';
import { CustomError, ErrorCode, createCustomError, isCustomError, getErrorMessage } from './errorUtils';

export { CustomError, createCustomError, isCustomError, getErrorMessage };
export type { ErrorCode };

interface ApiErrorMetadata {
  requestId: string;
  method: string;
  url: string;
  timestamp: string;
}

interface ApiErrorResponse {
  error: string;
  logged: boolean;
}

export const handleApiError = (error: unknown, req: NextRequest): NextResponse<ApiErrorResponse> => {
  const metadata = extractApiErrorMetadata(req);
  
  let customError: CustomError;
  if (isCustomError(error)) {
    customError = error;
  } else if (error instanceof Error) {
    customError = createCustomError('UNEXPECTED_ERROR');
    customError.message = error.message;
  } else {
    customError = createCustomError('UNEXPECTED_ERROR');
  }

  logError(
    'apiErrorUtils',
    'handleApiError',
    'API Error Occurred',
    `${customError.code}: ${customError.message}`,
    { error, metadata }
  );

  return NextResponse.json(
    { error: getErrorMessage(customError), logged: true },
    { status: customError.statusCode }
  );
};

/**
 * Extracts metadata from the API request for error logging purposes.
 * @param req - The NextRequest object.
 * @returns ApiErrorMetadata object containing request details.
 */
const extractApiErrorMetadata = (req: NextRequest): ApiErrorMetadata => {
  return {
    requestId: req.headers.get('x-request-id') ?? 'unknown',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Wraps an API route handler with error handling.
 * @param handler - The API route handler function.
 * @returns A wrapped handler function with error handling.
 */
export const withApiErrorHandling = (
  fileName: string,
  functionName: string,
  defaultErrorCode: ErrorCode,
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) => {
  return async (req: NextRequest, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (isCustomError(error)) {
        return handleApiError(error, req);
      }
      const customError = createCustomError(defaultErrorCode, 500, getErrorMessage(error));
      return handleApiError(customError, req);
    }
  };
};

/**
 * Creates a custom API error and throws it.
 * @param code - The error code.
 * @param message - The error message.
 * @param statusCode - The HTTP status code (optional, default is 500).
 * @throws CustomError
 */
export const throwApiError = (code: ErrorCode, message: string, statusCode: number = 500): never => {
  throw createCustomError(code, statusCode, message);
};
