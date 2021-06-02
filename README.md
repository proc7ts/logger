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
[quality-img]: https://app.codacy.com/project/badge/Grade/4e45ef3c83a3497fbe8f7fe3341e023c
[quality-link]: https://www.codacy.com/gh/proc7ts/logger/dashboard?utm_source=github.com&utm_medium=referral&utm_content=proc7ts/logger&utm_campaign=Badge_Grade
[coverage-img]: https://app.codacy.com/project/badge/Coverage/4e45ef3c83a3497fbe8f7fe3341e023c
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

Each method accepts arbitrary number of arguments.


Console Logger
--------------

`consoleLogger` is a [Logger] instance that logs to [console].

Note that the first parameter isn't treated in any special way. I.e. it is not a [format string].

[console]: https://developer.mozilla.org/en-US/docs/Web/API/Console
[format string]: https://developer.mozilla.org/en-US/docs/Web/API/Console#using_string_substitutions


Silent Logger
-------------

`silentLogger` is a [Logger] instance the never logs anything.
