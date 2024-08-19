![bitscaled-logger-logo (3)](https://github.com/user-attachments/assets/94d5860e-1dac-4845-956b-423380c46dba)
![Uploading bi<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4a90e2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3474c4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background with rounded corners -->
  <rect x="4" y="4" width="72" height="72" fill="url(#bgGradient)" rx="8" ry="8"/>
  
  <!-- Main text -->
  <text x="40" y="34" font-family="Arial Black, sans-serif" font-size="20" fill="white" text-anchor="middle" dominant-baseline="central">BIT</text>
  
  <!-- Subtext -->
  <text x="40" y="52" font-family="Arial, sans-serif" font-size="9.6" fill="white" text-anchor="middle" dominant-baseline="central">LOGIFY</text>
  
  <!-- Log lines -->
  <g stroke="white" stroke-linecap="round">
    <path d="M16 64 L64 64" stroke-width="3.2" opacity="0.8"/>
    <path d="M24 70 L56 70" stroke-width="2.4" opacity="0.6"/>
    <path d="M32 74 L48 74" stroke-width="1.6" opacity="0.4"/>
  </g>
  
  <!-- Binary overlay -->
  <text x="8" y="12" font-family="Courier, monospace" font-size="4" fill="white" opacity="0.1">
    01001100 01001111 01000111
  </text>
</svg>
tscaled-logger-logo (3).svg…]()


## Overview

Bitscaled Logger is a powerful, centralized logging system designed specifically for Next.js applications. It provides a consistent and scalable approach to logging, error handling, and API response management through a single, easy-to-use utility.

> [!NOTE]
> Bitscaled Logger is ideal for maintaining clean, scalable code and includes advanced features such as custom error handling, function wrapping, and customizable logging configurations.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
  - [General Logging](#general-logging)
  - [API Error Handling](#api-error-handling)
- [Configuration](#configuration)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install the library using npm:

```bash
npm install bitscaled-logger
```

## Setup

1. Import and initialize the logging system in your application's entry point:

```typescript
import { initializeLogging } from 'bitscaled-logger';

// Initialize logging
initializeLogging();
```

2. Import logging functions from the library where needed:

```typescript
import {
  logInfo,
  logWarn,
  logError,
  logDebug,
} from 'bitscaled-logger';
```

> [!IMPORTANT]
> Always initialize the logging system at your application's entry point to ensure proper functionality throughout your app.

## Usage

### General Logging

```typescript
logInfo('fileName', 'functionName', 'action', 'message');
logWarn('fileName', 'functionName', 'action', 'warning message');
logError('fileName', 'functionName', 'action', 'error message');
logDebug('fileName', 'functionName', 'action', 'debug message');
```

> [!TIP]
> Use appropriate log levels based on the nature of the message to make debugging and monitoring easier.

### API Error Handling

```typescript
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
```

> [!CAUTION]
> Always wrap your API route handlers with `withApiErrorHandling` to ensure consistent error handling across your application.

## Configuration

You can adjust the logging configuration to fit your specific needs:

```typescript
import { setLoggingConfig } from 'bitscaled-logger';

const customConfig = {
  logFunctionCalls: false,
  logDebugInProduction: true,
};

setLoggingConfig(customConfig);
```

> [!WARNING]
> Be cautious when enabling debug logging in production environments, as it may impact performance and expose sensitive information.

## Best Practices

1. Use `bitscaled-logger` as the single import source for all logging functionality.
2. Provide consistent and meaningful `fileName` and `functionName` parameters.
3. Leverage advanced features like `withLogging` for automatic entry/exit logging of functions.
4. Utilize `withApiErrorHandling` for all API route handlers to ensure consistent error handling.
5. Sanitize sensitive data before logging using the built-in sanitization features.

## Contributing

We welcome contributions to Bitscaled Logger! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

For more detailed information on usage and advanced features, please refer to our [comprehensive guide](./logging-system-guide.md).
