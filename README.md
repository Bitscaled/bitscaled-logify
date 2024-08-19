
# Bitscaled Logger

## Overview

**Bitscaled Logger** is a centralized logging system designed for Next.js applications. It provides a consistent approach to logging, error handling, and API response management through a single utility. This library is ideal for maintaining clean, scalable code and includes advanced features such as custom error handling, function wrapping, and customizable logging configurations.

## Installation

Install the library using npm:

\`\`\`bash
npm install bitscaled-logger
\`\`\`

## Setup

1. Import and initialize the logging system in your application's entry point:

\`\`\`typescript
import { initializeLogging } from 'bitscaled-logger';

// Initialize logging
initializeLogging();
\`\`\`

2. Import logging functions from the library where needed:

\`\`\`typescript
import {
  logInfo,
  logWarn,
  logError,
  logDebug,
} from 'bitscaled-logger';
\`\`\`

## Usage

### General Logging

\`\`\`typescript
logInfo('fileName', 'functionName', 'action', 'message');
logWarn('fileName', 'functionName', 'action', 'warning message');
logError('fileName', 'functionName', 'action', 'error message');
logDebug('fileName', 'functionName', 'action', 'debug message');
\`\`\`

### API Error Handling

\`\`\`typescript
import { withApiErrorHandling } from 'bitscaled-logger';

const handler = async (req) => {
  try {
    // Your API logic
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const GET = withApiErrorHandling('fileName', 'handlerName', handler);
\`\`\`

## Configuration

You can adjust the logging configuration to fit your needs:

\`\`\`typescript
import { setLoggingConfig } from 'bitscaled-logger';

const customConfig = {
  logFunctionCalls: false,
  logDebugInProduction: true,
};

setLoggingConfig(customConfig);
\`\`\`

## Best Practices

1. Use `bitscaled-logger` as the single import source for logging.
2. Provide consistent `fileName` and `functionName` parameters.
3. Leverage advanced features like `withLogging` and `withApiErrorHandling`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

