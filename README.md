![bitscaled-logger-logo (3)](https://github.com/user-attachments/assets/0252d753-71be-47fe-9002-7d1ca482af39)


## Overview

Bitscaled Logger is a powerful, centralized logging system designed specifically for Next.js applications. It provides a consistent and scalable approach to logging, error handling, and API response management through a single, easy-to-use utility.

> [!NOTE]
> Bitscaled Logger is ideal for maintaining clean, scalable code and includes advanced features such as custom error handling, function wrapping, and customizable logging configurations.

# 📘 Comprehensive Logging and API Error Handling Guide

## Table of Contents

- [📘 Comprehensive Logging and API Error Handling Guide](#-comprehensive-logging-and-api-error-handling-guide)
  - [Table of Contents](#table-of-contents)
  - [🚀 Introduction](#-introduction)
  - [⚙️ Setup](#️-setup)
  - [🔰 Basic Usage](#-basic-usage)
    - [📝 General Logging (All Files)](#-general-logging-all-files)
    - [🌐 API-Specific Logging](#-api-specific-logging)
  - [🔧 Advanced Usage](#-advanced-usage)
    - [🚨 Custom Error Handling (All Files)](#-custom-error-handling-all-files)
    - [🔄 Function Wrapping with Logging (All Files)](#-function-wrapping-with-logging-all-files)
    - [⚙️ Adjusting Logging Configuration (All Files)](#️-adjusting-logging-configuration-all-files)
    - [🌐 API Error Handling (API Files Only)](#-api-error-handling-api-files-only)
  - [💡 Best Practices](#-best-practices)
  - [⚠️ Common Pitfalls](#️-common-pitfalls)
  - [🔄 Migration Guide](#-migration-guide)

## 🚀 Introduction

This guide outlines the implementation of a centralized logging system and API error handling using the `logging.ts` file as the single point of entry. This approach ensures consistency, ease of maintenance, and flexibility across your application.

## ⚙️ Setup

1. Ensure `logging.ts` is located at `@/components/utils/logging/logging.ts`.

2. In your application's entry point (e.g., `pages/_app.tsx` or `app/layout.tsx`), initialize the logging system:

   ```typescript
   import { initializeLogging } from '@/components/utils/logging/logging';

   // ...

   initializeLogging();
   ```

3. Import necessary functions and types:

   For all files:
   ```typescript
   import {
     logInfo,
     logWarn,
     logError,
     logDebug,
     logSuccess,
     logFailure,
     debugLog,
     handleError,
     createCustomError,
     isCustomError,
     getErrorMessage
   } from '@/components/utils/logging/logging';

   import type { CustomError, ErrorCode, LogOptions, LoggingConfig } from '@/components/utils/logging/logging';
   ```

   Additional imports for API files:
   ```typescript
   import {
     withApiErrorHandling,
     throwApiError,
     createLoggedResponse,
     createLoggedErrorResponse
   } from '@/components/utils/logging/logging';
   ```

## 🔰 Basic Usage

### 📝 General Logging (All Files)

<details>
<summary>Click to expand general logging examples</summary>

```typescript
logInfo('fileName', 'functionName', 'action', 'message', { metadata: { key: 'value' } });
logWarn('fileName', 'functionName', 'action', 'warning message', { showToast: true });
logError('fileName', 'functionName', 'action', 'error message', { error: new Error('Something went wrong') });
logDebug('fileName', 'functionName', 'action', 'debug message', { metadata: { debug: 'info' } });

// Success and Failure Logging
logSuccess('fileName', 'functionName', 'Operation completed successfully', { result: 'data' });
logFailure('fileName', 'functionName', 'Operation failed', new Error('Failure reason'));

// Debug Logging
debugLog('fileName', 'functionName', 'action', 'Debug message', { extraInfo: 'Additional debug data' });
```

</details>

### 🌐 API-Specific Logging

<details>
<summary>Click to expand API-specific logging examples</summary>

```typescript
// Creating Responses
return createLoggedResponse(200, { data: "success" }, "fileName", "GET");
return createLoggedErrorResponse("Error occurred", "fileName", "POST", 400);
```

</details>

## 🔧 Advanced Usage

### 🚨 Custom Error Handling (All Files)

<details>
<summary>Click to expand custom error handling example</summary>

```typescript
try {
  throw createCustomError('NOT_FOUND', 404, 'Resource not found');
} catch (error) {
  handleError('fileName', 'functionName', 'action', error, 'Additional info');
  
  if (isCustomError(error)) {
    console.log(error.code, error.statusCode);
  }
  
  const errorMessage = getErrorMessage(error);
}
```

</details>

### 🔄 Function Wrapping with Logging (All Files)

<details>
<summary>Click to expand function wrapping example</summary>

```typescript
import { withLogging } from '@/components/utils/logging/logging';

const myFunction = withLogging('fileName', 'myFunction', (param1, param2) => {
  // Your function logic here
  return result;
});
```

</details>

### ⚙️ Adjusting Logging Configuration (All Files)

<details>
<summary>Click to expand logging configuration example</summary>

```typescript
import { setLoggingConfig, LoggingConfig } from '@/components/utils/logging/logging';

const customConfig: Partial<LoggingConfig> = {
  logFunctionCalls: false,
  logDebugInProduction: true,
};

setLoggingConfig(customConfig);
```

</details>

### 🌐 API Error Handling (API Files Only)

<details>
<summary>Click to expand API error handling examples</summary>

Using `withApiErrorHandling`:

```typescript
export const GET = withApiErrorHandling(
  "fileName",                      // For logging purposes
  "handlerName",                   // For logging purposes
  "UNEXPECTED_ERROR" as ErrorCode, // Default error code
  async (req: NextRequest) => {
    // Your handler logic here
  }
);
```

Using `throwApiError`:

```typescript
throwApiError(ErrorCode, "Error message", statusCode);
```

Handling External API Responses:

```typescript
const value = response.data?.reports?.[0]?.data?.rows?.[0]?.metrics?.[0]?.values?.[0] ?? "0";

const dimensions = row.dimensions as string[];
const metrics = row.metrics as Array<{ values: string[] }>;

if (!response.data?.reports?.length) {
  throwApiError("API_ERROR", "No report data received", 500);
}
```

</details>

## 💡 Best Practices

- [x] Always use `logging.ts` as the single import source for logging functionality.
- [x] Provide meaningful and consistent `fileName` and `functionName` parameters.
- [x] Use appropriate log levels based on the nature of the message:
  | Level | Function | Use Case |
  |-------|----------|----------|
  | Info | `logInfo` | General information |
  | Warn | `logWarn` | Potential issues |
  | Error | `logError` | Errors and exceptions |
  | Debug | `logDebug` | Detailed debugging information |
- [x] Leverage `withLogging` for functions that benefit from automatic entry/exit logging.
- [x] Use `createCustomError` for creating standardized error objects.
- [x] Handle errors consistently using `handleError` and `isCustomError`.
- [x] Sanitize sensitive data before logging using the built-in sanitization in `loggingUtils.ts`.
- [x] For API routes, always use `withApiErrorHandling` to wrap your handlers.
- [x] Use `throwApiError` for known error conditions in API routes.
- [x] Handle undefined values with optional chaining (`?.`) and nullish coalescing (`??`).

## ⚠️ Common Pitfalls

1. 🚫 DO NOT import directly from `debugUtils.ts`, `errorUtils.ts`, `apiErrorUtils.ts`, or `loggingUtils.ts`. Always use `logging.ts`.
2. 🚫 Avoid mixing the new logging system with `console.log` calls. Use the provided logging functions instead.
3. 🔑 Don't forget to initialize logging with `initializeLogging()` at your application's entry point.
4. 🔍 Be cautious with `logDebug` in production; ensure it's only used when necessary.
5. 🏷️ Incorrect usage of `ErrorCode` types: Make sure to import and use the correct `ErrorCode` type from the logging module.
6. 🔗 Forgetting to handle possible undefined values: Always use optional chaining (`?.`) when accessing properties that might be undefined.
7. 🌐 For API routes, missing arguments in `withApiErrorHandling` or incorrect `throwApiError` usage.
8. 🔢 Using incorrect error codes or status codes in API error handling.
9. 🧩 Not using type assertions when working with external API data in API routes.
10. 📊 Passing non-serializable data in the `metadata` field of log options.

## 🔄 Migration Guide

When migrating existing code to use the new logging system:

1. Replace all direct imports from individual utility files with imports from `logging.ts`.
2. Replace `console.log`, `console.warn`, and `console.error` calls with their respective logging functions.
3. Replace custom error creation with `createCustomError`.
4. Update any custom error handling to use `handleError` and `isCustomError`.
5. Wrap complex functions with `withLogging` for automatic entry/exit logging.
6. Use `logSuccess` and `logFailure` for clear operation outcome logging.
7. For API routes, wrap handlers with `withApiErrorHandling` and use `throwApiError` for error conditions.

<details>
<summary>Example of migrated code (non-API file)</summary>

```typescript
import { 
  logInfo, 
  logError, 
  createCustomError, 
  handleError, 
  withLogging 
} from '@/components/utils/logging/logging';

const performOperation = withLogging('fileName', 'performOperation', async (data) => {
  try {
    logInfo('fileName', 'performOperation', 'Starting', 'Beginning operation', { metadata: { inputData: data } });
    
    // Your operation logic here
    const result = await someAsyncOperation(data);
    
    logInfo('fileName', 'performOperation', 'Completed', 'Operation successful', { metadata: { result } });
    return result;
  } catch (error) {
    const customError = createCustomError('OPERATION_FAILED', 500, 'Failed to perform operation');
    handleError('fileName', 'performOperation', 'OperationFailed', customError, `Failed with input: ${JSON.stringify(data)}`);
    throw customError;
  }
});
```

</details>

<details>
<summary>Example of migrated code (API file)</summary>

```typescript
import { 
  withApiErrorHandling, 
  throwApiError, 
  logInfo, 
  createLoggedResponse 
} from '@/components/utils/logging/logging';

export const GET = withApiErrorHandling(
  'api-fileName',
  'getHandler',
  'UNEXPECTED_ERROR' as ErrorCode,
  async (req: NextRequest) => {
    try {
      logInfo('api-fileName', 'getHandler', 'Processing', 'Processing API request');
      
      // Your API logic here
      const result = await someApiOperation();
      
      return createLoggedResponse(200, { success: true, data: result }, 'api-fileName', 'getHandler');
    } catch (error) {
      throwApiError('API_ERROR', 'Failed to process request', 500);
    }
  }
);
```

</details>

> 💡 **Pro Tip:** Regularly review and refactor your error handling and logging code to maintain consistency and improve maintainability across your application.
