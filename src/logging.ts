/**
 * Comprehensive Logging Module
 * 
 * This module exports all logging-related utilities and provides
 * high-level wrappers for common logging operations, including API error handling.
 * 
 * @module logging
 * @file components/utils/logging.ts
 */

import {
  logInfo,
  logWarn,
  logError,
  logDebug,
  createLoggedResponse,
  createLoggedErrorResponse,
  LogOptions,
  setCurrentLoggingConfig
} from './loggingUtils';

import { debugLog } from './debugUtils';
import { 
  handleError, 
  CustomError, 
  ErrorCode, 
  createCustomError, 
  isCustomError, 
  getErrorMessage 
} from './errorUtils';

import {
  throwApiError,
  withApiErrorHandling
} from './apiErrorUtils';

// Re-export everything
export {
  logInfo,
  logWarn,
  logError,
  logDebug,
  createLoggedResponse,
  createLoggedErrorResponse,
  debugLog,
  handleError,
  createCustomError,
  isCustomError,
  getErrorMessage,
  throwApiError,
  withApiErrorHandling,
};

// Re-export types
export type { CustomError, ErrorCode, LogOptions };

export interface LoggingConfig {
  logFunctionCalls: boolean;
  logFunctionResults: boolean;
  logDebugInProduction: boolean;
}

export const defaultLoggingConfig: LoggingConfig = {
  logFunctionCalls: process.env.NODE_ENV === 'development',
  logFunctionResults: process.env.NODE_ENV === 'development',
  logDebugInProduction: false,
};

let currentLoggingConfig = { ...defaultLoggingConfig };

export const setLoggingConfig = (config: Partial<LoggingConfig>) => {
  currentLoggingConfig = { ...currentLoggingConfig, ...config };
  setCurrentLoggingConfig(currentLoggingConfig);
};

export const withLogging = <T extends (...args: any[]) => any>(
  fileName: string,
  functionName: string,
  func: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return (...args: Parameters<T>) => {
    if (currentLoggingConfig.logFunctionCalls) {
      logDebug(fileName, functionName, 'Function called', `Executing ${functionName}`);
    }
    try {
      const result = func(...args);
      if (currentLoggingConfig.logFunctionResults) {
        logInfo(fileName, functionName, 'Function completed', `${functionName} executed successfully`);
      }
      return result;
    } catch (err) {
      logError(fileName, functionName, 'Function error', `Error in ${functionName}`, { error: err });
      throw err;
    }
  };
};

const productionLoggingConfig: LoggingConfig = {
  logFunctionCalls: false,
  logFunctionResults: false,
  logDebugInProduction: false,
};

const developmentLoggingConfig: LoggingConfig = {
  logFunctionCalls: true,
  logFunctionResults: true,
  logDebugInProduction: true,
};

export const initializeLogging = () => {
  if (process.env.NODE_ENV === 'production') {
    setLoggingConfig(productionLoggingConfig);
  } else {
    setLoggingConfig(developmentLoggingConfig);
  }
};

/**
 * Creates a success log entry
 * @param fileName - The name of the file creating the log
 * @param functionName - The name of the function creating the log
 * @param message - The success message
 * @param data - Additional data to log (optional)
 */
export const logSuccess = (
  fileName: string,
  functionName: string,
  message: string,
  data?: any
) => {
  logInfo(fileName, functionName, 'Success', message, { metadata: data });
};

/**
 * Creates a failure log entry
 * @param fileName - The name of the file creating the log
 * @param functionName - The name of the function creating the log
 * @param message - The failure message
 * @param error - The error object or message
 */
export const logFailure = (
  fileName: string,
  functionName: string,
  message: string,
  error: any
) => {
  logError(fileName, functionName, 'Failure', message, { error });
};