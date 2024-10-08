# Logger API

[![NPM][npm-image]][npm-url]
[![Build Status][build-status-img]][build-status-link]
[![Code Quality][quality-img]][quality-link]
[![Coverage][coverage-img]][coverage-link]
[![GitHub Project][github-image]][github-url]
[![API Documentation][api-docs-image]][api documentation]

This package contains a logging API, such as [Logger] and [Loggable] interfaces along with some tools for their
processing and very basic [logger implementations].

The [@run-z/log-z] package is a reference implementation of this API. It supports structured logs, various logging
mechanisms (e.g. log files), and customizable log formats.

[npm-image]: https://img.shields.io/npm/v/@proc7ts/logger.svg?logo=npm
[npm-url]: https://www.npmjs.com/package/@proc7ts/logger
[build-status-img]: https://github.com/proc7ts/logger/workflows/Build/badge.svg
[build-status-link]: https://github.com/proc7ts/logger/actions?query=workflow:Build
[quality-img]: https://app.codacy.com/project/badge/Grade/f33e01ece3454d2a8a613536ea4228e2
[quality-link]: https://app.codacy.com/gh/proc7ts/logger/dashboard?utm_source=gh&utm_medium=referral&utm_content=proc7ts/logger&utm_campaign=Badge_Grade
[coverage-img]: https://app.codacy.com/project/badge/Coverage/f33e01ece3454d2a8a613536ea4228e2
[coverage-link]: https://app.codacy.com/gh/proc7ts/logger/dashboard?utm_source=gh&utm_medium=referral&utm_content=proc7ts/logger&utm_campaign=Badge_Coverage
[github-image]: https://img.shields.io/static/v1?logo=github&label=GitHub&message=project&color=informational
[github-url]: https://github.com/proc7ts/logger
[api-docs-image]: https://img.shields.io/static/v1?logo=typescript&label=API&message=docs&color=informational
[api documentation]: https://proc7ts.github.io/logger/
[@run-z/log-z]: https://www.npmjs.com/package/@run-z/log-z

## Logger

[logger]: #logger

`Logger` interface declares methods corresponding to generic logger levels:

- `error(...args)` - Logs error.
- `warn(...args)` - Logs warning.
- `info(...args)` - Logs informational message.
- `debug(...args)` - Logs debug message.
- `trace(...args)` - Logs tracing message. This may lead to outputting of stack trace.

Each method accepts arbitrary number of arguments.

## Loggable Values

[loggable]: #loggable-values

An object passed as an argument to one of the `Logger` methods can customize how it is logged by implementing a
`toLog()` method of `Loggable` interface.

In the simple case, the `toLog()` method may return another value that will be logged instead of the original one.

It may also return an array of values that will be inserted to the log line instead of original value. This may be an
empty array to completely remove the value from the log line.

A more advanced processing is possible by directly manipulating a `DueLog` parameter passed to the `toLog()` method.
This parameter has the following properties that can be directly manipulated:

- `on` - A hint indicating the logging stage.

  A `toLog()` method may wish to conditionally process the message depending on the stage.

  Possible values are:

  - `'in'` - _input stage_. Set for the logger input. I.e., for the log line passed to the logger method.
  - `'out'` - _output stage_. Set by log writer. I.e., right before the message written to the log.
  - `undefined` - _default stage_. When set, the value should be processed unconditionally.

- `line` - Log line to process and log.

  Can be modified or replaced to change the message to log.

- `index` - An index of currently processed element of the log `line`.

  May be equal to the log line length to indicate additional value processing that may affect the message to log.

  Can be modified to specify the next element to process.

Every logger recognizes `Loggable` instances and processes them accordingly. To process the log line manually a
`dueLog()` function can be used.

## Tagged Log Line

The [Logger] methods allow to log any values. The arguments passed to one of these method called _log line_. It is up to
the logger implementation of how to format the log line.

To customize the format of the log line a template string tagged by `logline` can be used:

```typescript
import { consoleLogger, logline } from '@proc7ts/logger';

consoleLogger.error(logline`
  Request: ${request.method} ${request.path}
  Error: ${error.statusCode} (${error.statusText})
`);

// Request: GET /favicon.ico Error: 404 (Not Found)
```

The `logline`-tagged template formats the log line accordingly the following rules:

1. Template strings and values not separated by whitespace joined into single string.
2. The values separated by whitespace are added to the log line as is.
3. Template strings trimmed.
4. Any number of subsequent whitespace in template strings replaced with single space.
5. Leading and/or trailing template string removed if it became empty.

All [Loggable] values processed before being joined into string. They may be processed as many times as requested.
The final joining happens at the output (`'out'`) or default (`undefined`) logging stage.

## Logger Implementations

[logger implementations]: #logger-implementations

### Console Logger

`consoleLogger` is a [Logger] instance that logs to [console].

Note that the first parameter isn't treated in any special way. I.e., it is not a [format string].

[console]: https://developer.mozilla.org/en-US/docs/Web/API/Console
[format string]: https://developer.mozilla.org/en-US/docs/Web/API/Console#using_string_substitutions

### Processing Logger

`processingLogger()` function creates a logger that processes `Loggable` values and logs with another logger.

### Proxy Logger

`proxyLogger()` function creates a logger that proxies logging to another one.

The target logger can change dynamically.

### Silent Logger

`silentLogger` is a [Logger] instance the never logs anything.
