Logger API
==========

[![NPM][npm-image]][npm-url]
[![Build Status][build-status-img]][build-status-link]
[![Code Quality][quality-img]][quality-link]
[![Coverage][coverage-img]][coverage-link]
[![GitHub Project][github-image]][github-url]
[![API Documentation][api-docs-image]][API documentation]

[npm-image]: https://img.shields.io/npm/v/@proc7ts/logger.svg?logo=npm
[npm-url]: https://www.npmjs.com/package/@proc7ts/logger
[build-status-img]: https://github.com/proc7ts/logger/workflows/Build/badge.svg
[build-status-link]: https://github.com/proc7ts/logger/actions?query=workflow:Build
[quality-img]: https://app.codacy.com/project/badge/Grade/f33e01ece3454d2a8a613536ea4228e2
[quality-link]: https://www.codacy.com/gh/proc7ts/logger/dashboard?utm_source=github.com&utm_medium=referral&utm_content=proc7ts/logger&utm_campaign=Badge_Grade
[coverage-img]: https://app.codacy.com/project/badge/Coverage/f33e01ece3454d2a8a613536ea4228e2
[coverage-link]: https://www.codacy.com/gh/proc7ts/logger/dashboard?utm_source=github.com&utm_medium=referral&utm_content=proc7ts/logger&utm_campaign=Badge_Coverage
[github-image]: https://img.shields.io/static/v1?logo=github&label=GitHub&message=project&color=informational
[github-url]: https://github.com/proc7ts/logger
[api-docs-image]: https://img.shields.io/static/v1?logo=typescript&label=API&message=docs&color=informational
[API documentation]: https://proc7ts.github.io/logger/


Logger
------
[Logger]: #logger

`Logger` interface declares methods corresponding to generic logger levels:

- `error(...args)` - Logs error.
- `warn(...args)` - Logs warning.
- `info(...args)` - Logs informational message.
- `debug(...args)` - Logs debug message.
- `trace(...args)` - Logs tracing message. This may lead to outputting of stack trace.

Each method accepts arbitrary number of arguments.


Loggable Values
---------------

An object passes as an argument to one of the `Logger` methods can customize how it is logged by implementing a
`toLog()` method of `Loggable` interface.

In the simples case, the `toLog()` method may return another value that will be logged instead of the original one.

It may also return an array of values that will be inserted to the log line instead of original value. This may be an
empty array to completely remove the value from the log line.

A more advanced processing is possible by directly manipulating a `DueLog` parameter passed to the `toLog()` method.
This parameter has the following properties that can be directly manipulated:

- `on` - A hint indicating the logging stage.

  A `toLog()` method may wish to conditionally process the message depending on the stage.
  
  Possible values are:
  - `'in'` is set for logger input. I.e., for the log line passed to the logger method.
  - `'out'` is set by log writer. I.e., right before the message written to the log.
  - `undefined` when the value should be processed unconditionally.

- `line` - Log line to process and log.

  Can be modified or replaced to change the message to log.

- `index` - An index of currently processed element of the log `line`.

  May be equal to the log line length to indicate additional value processing that may affect the message to log.
  
  Can be modified to specify the next element to process.

Every logger recognizes `Loggable` instances and processes them accordingly. To process the log line manually a
`dueLog()` function can be used.


Logger Implementations
----------------------

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
