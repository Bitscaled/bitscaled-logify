/**
 * Debug Utilities
 * 
 * This module provides utility functions for debugging purposes.
 * 
 * @module debugUtils
 * @file components/utils/logging/debugUtils.ts
 */

/**
 * Logs a debug message with detailed context information.
 * @param fileName - The name of the file where the debug message is coming from.
 * @param functionName - The name of the function generating the debug message.
 * @param action - A description of the action being performed.
 * @param message - The main debug message.
 * @param optionalParams - Additional parameters for the debug message.
 */
export const debugLog = (
  fileName: string,
  functionName: string,
  action: string,
  message: string,
  ...optionalParams: any[]
) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[DEBUG] [${fileName} -> ${functionName}] [${action}]: ${message}`, ...optionalParams);
  }
};