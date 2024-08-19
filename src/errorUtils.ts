/**
 * @file errorUtils.ts
 * @filepath components/utils/logging/errorUtils.ts
 * @description Handles an error by logging it and optionally performing additional actions.
 */
import { logError } from './loggingUtils';

export class CustomError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'CustomError';
  }
}

export const errorMessages = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_LOCKED: 'Your account has been temporarily locked. Please try again later or contact support.',
  RATE_LIMIT_EXCEEDED: 'Too many attempts. Please try again later.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  INVALID_TOKEN: 'Invalid or expired token.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
  DATABASE_ERROR: 'A database error occurred. Please try again later.',
  UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
};

export type ErrorCode = keyof typeof errorMessages;

export const createCustomError = (code: ErrorCode, statusCode?: number, additionalInfo?: string): CustomError => {
  let message = errorMessages[code];
  if (additionalInfo) {
    message += ' ' + additionalInfo;
  }
  return new CustomError(code, message, statusCode);
};

export const handleError = (
  fileName: string,
  functionName: string,
  action: string,
  error: unknown,
  additionalInfo?: string
): CustomError => {
  let customError: CustomError;

  if (error instanceof CustomError) {
    customError = error;
  } else if (error instanceof Error) {
    customError = createCustomError('UNEXPECTED_ERROR', 500, error.message);
  } else {
    customError = createCustomError('UNEXPECTED_ERROR');
  }

  let logMessage = `${customError.code}: ${customError.message}`;
  if (additionalInfo) {
    logMessage += '. ' + additionalInfo;
  }

  logError(
    fileName,
    functionName,
    action,
    logMessage,
    { error: customError }
  );

  return customError;
};

export const isCustomError = (error: unknown): error is CustomError => {
  return error instanceof CustomError;
};

export const getErrorMessage = (error: unknown): string => {
  if (isCustomError(error)) {
    return error.message;
  }
  return errorMessages.UNEXPECTED_ERROR;
};