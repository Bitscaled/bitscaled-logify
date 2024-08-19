/**
 * Logging Utilities
 *
 * This module provides comprehensive logging utilities for various types of information,
 * including general logs, warnings, errors, debug messages, and cookie operations.
 *
 * @module loggingUtils
 * @file components/utils/logging/loggingUtils.ts
 */
import { NextResponse } from 'next/server';
import { ToastOptions } from 'react-toastify';
import { LoggingConfig } from './logging';

let currentLoggingConfig: LoggingConfig;

export const setCurrentLoggingConfig = (config: LoggingConfig) => {
  currentLoggingConfig = config;
};

export type AlertType = 'success' | 'error' | 'info' | 'warning';
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogOptions {
  showAlert?: boolean;
  alertOptions?: ToastOptions;
  error?: unknown;
  metadata?: Record<string, any>;
  showToast?: boolean;
}

const isClient = typeof window !== 'undefined';
const isDevelopment = process.env.NODE_ENV === 'development';

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const CURRENT_LOG_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] <= LOG_LEVELS[CURRENT_LOG_LEVEL];
};

const sanitizeData = (data: any): any => {
  const sensitiveKeys = ['password', 'token', 'secret', 'apiKey'];
  if (typeof data === 'object' && data !== null) {
    return Object.keys(data).reduce((acc: any, key) => {
      acc[key] = sensitiveKeys.includes(key.toLowerCase()) ? '***' : sanitizeData(data[key]);
      return acc;
    }, Array.isArray(data) ? [] : {});
  }
  return data;
};

// This function will be used to show alerts
// It should be implemented where the useAlerts hook is available
let showAlert: (message: string, type: AlertType, options?: ToastOptions) => void;

export const setAlertFunction = (alertFunction: typeof showAlert) => {
  showAlert = alertFunction;
};

const baseLog = (
  level: LogLevel,
  fileName: string,
  functionName: string,
  action: string,
  message: string,
  options: LogOptions = {},
  ...optionalParams: any[]
) => {
  if (!shouldLog(level)) return;

  const timestamp = new Date().toISOString();
  const sanitizedParams = optionalParams.map(sanitizeData);
  const logMethod = (console[level] as Function).bind(console);
  
  logMethod(
    `[${level.toUpperCase()}] [${timestamp}] [${fileName} -> ${functionName}] [${action}]: ${message}`,
    ...sanitizedParams
  );

  if (isClient && options.showToast && showAlert) {
    showAlert(message, level as AlertType, options.alertOptions);
  }
};

export const logInfo = (
  fileName: string,
  functionName: string,
  action: string,
  message: string,
  options: LogOptions = {},
  ...optionalParams: any[]
) => {
  baseLog('info', fileName, functionName, action, message, { ...options, showToast: options.showToast ?? false }, ...optionalParams);
};

export const logWarn = (
  fileName: string,
  functionName: string,
  action: string,
  message: string,
  options: LogOptions = {},
  ...optionalParams: any[]
) => {
  baseLog('warn', fileName, functionName, action, message, options, ...optionalParams);
};

export const logError = (
  fileName: string,
  functionName: string,
  action: string,
  message: string,
  options: LogOptions = {},
  ...optionalParams: any[]
) => {
  baseLog('error', fileName, functionName, action, message, options, ...optionalParams);
};

export const logDebug = (
  fileName: string,
  functionName: string,
  action: string,
  message: string,
  options: LogOptions = {},
  ...optionalParams: any[]
) => {
  if (isDevelopment || (currentLoggingConfig && currentLoggingConfig.logDebugInProduction)) {
    baseLog('debug', fileName, functionName, action, message, options, ...optionalParams);
  }
};

// ... (keep other existing functions like logCookie, logRequest, logAllCookies)

export const createLoggedResponse = (
  statusCode: number,
  body: any,
  fileName: string,
  functionName: string
): NextResponse => {
  const response = NextResponse.json(body, { status: statusCode });
  logInfo(fileName, functionName, 'Response created', `Status: ${statusCode}`, {}, sanitizeData(body));
  return response;
};

export const createLoggedErrorResponse = (
  errorMessage: string,
  fileName: string,
  functionName: string,
  statusCode: number = 500,
): NextResponse => {
  const response = NextResponse.json({ error: errorMessage }, { status: statusCode });
  logError(fileName, functionName, 'Error response', `Status: ${statusCode}, Message: ${errorMessage}`, { showAlert: true });
  return response;
};