Bitscaled Logger
Overview
Bitscaled Logger is a comprehensive logging solution tailored for Next.js applications. This library centralizes all logging and error handling, providing a structured and consistent approach to managing logs across your application. With features like advanced API error handling, custom error management, and configurable logging options, Bitscaled Logger is the ideal tool for developers aiming for maintainable and scalable code.

Features
Centralized logging through a single entry point
Support for general logging, warnings, errors, and debug messages
Advanced API error handling with custom error support
Function wrapping for automatic logging of function entry and exit
Customizable logging configuration
Logged API responses for consistent response handling
Integration with Next.js for seamless usage
Installation
To install Bitscaled Logger, use npm or yarn:

bash
Copy code
npm install bitscaled-logger
or

bash
Copy code
yarn add bitscaled-logger
Setup
Ensure the logging.ts file is located at @/components/utils/logging/logging.ts.

Initialize the logging system in your application's entry point:

typescript
Copy code
import { initializeLogging } from '@/components/utils/logging/logging';

initializeLogging();
Import the necessary logging functions from logging.ts wherever needed:

typescript
Copy code
import {
  logInfo,
  logWarn,
  logError,
  logDebug,
  // ... other necessary functions
} from '@/components/utils/logging/logging';
Basic Usage
General Logging
typescript
Copy code
logInfo('fileName', 'functionName', 'action', 'message', { metadata: { key: 'value' } });
logWarn('fileName', 'functionName', 'action', 'warning message', { showToast: true });
logError('fileName', 'functionName', 'action', 'error message', { error: new Error('Something went wrong') });
logDebug('fileName', 'functionName', 'action', 'debug message', { metadata: { debug: 'info' } });
Success and Failure Logging
typescript
Copy code
logSuccess('fileName', 'functionName', 'Operation completed successfully', { result: 'data' });
logFailure('fileName', 'functionName', 'Operation failed', new Error('Failure reason'));
Advanced Usage
API Error Handling
typescript
Copy code
import { NextRequest, NextResponse } from 'next/server';
import { withApiErrorHandling, throwApiError } from '@/components/utils/logging/logging';

const handler = async (req: NextRequest) => {
  try {
    // Your API logic here
    if (someCondition) {
      throwApiError('VALIDATION_ERROR', 400);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    throw error;
  }
};

export const GET = withApiErrorHandling('fileName', 'handlerName', handler);
Function Wrapping
typescript
Copy code
const myFunction = withLogging('fileName', 'myFunction', () => {
  // Your function logic here
});
Custom Error Handling
typescript
Copy code
try {
  throw createCustomError('NOT_FOUND', 404, 'Resource not found');
} catch (error) {
  handleError('fileName', 'functionName', 'action', error, 'Additional info');
  
  if (isCustomError(error)) {
    console.log(error.code, error.statusCode);
  }
  
  const errorMessage = getErrorMessage(error);
}
Logged Responses in API Routes
typescript
Copy code
export async function GET(req: NextRequest) {
  return createLoggedResponse(200, { data: 'success' }, 'fileName', 'GET');
}

export async function POST(req: NextRequest) {
  if (error) {
    return createLoggedErrorResponse('Error occurred', 'fileName', 'POST', 400);
  }
}
Adjusting Logging Configuration
typescript
Copy code
import { setLoggingConfig, LoggingConfig } from '@/components/utils/logging/logging';

const customConfig: Partial<LoggingConfig> = {
  logFunctionCalls: false,
  logDebugInProduction: true,
};

setLoggingConfig(customConfig);
Best Practices
Always use logging.ts as the single import source for logging functionality.
Provide meaningful and consistent fileName and functionName parameters.
Use appropriate log levels (logInfo, logWarn, logError, logDebug) based on the nature of the message.
Leverage withLogging for functions that benefit from automatic entry/exit logging.
Use withApiErrorHandling for all API route handlers to ensure consistent error handling.
Sanitize sensitive data before logging using the built-in sanitization.
Common Pitfalls
DO NOT import directly from apiErrorUtils.ts, debugUtils.ts, errorUtils.ts, or loggingUtils.ts. Always use logging.ts.
Avoid mixing the new logging system with console.log calls. Use the provided logging functions instead.
Don't forget to initialize logging with initializeLogging() at your application's entry point.
Be cautious with logDebug in production; ensure it's only used when necessary.
Avoid throwing errors directly in API routes; use throwApiError instead for consistent handling.
Migration Guide
When migrating from an existing logging system:

Replace all direct imports from individual utility files with imports from logging.ts.
Replace console.log, console.warn, and console.error calls with their respective logging functions.
Wrap API route handlers with withApiErrorHandling.
Replace custom error throwing with throwApiError or createCustomError.
Update any custom error handling to use handleError and isCustomError.
Replace direct response creation in API routes with createLoggedResponse or createLoggedErrorResponse.
License
This project is licensed under the MIT License.
