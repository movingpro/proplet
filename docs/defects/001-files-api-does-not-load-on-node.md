# 001: The files API does not load on Node

| Field    | Value                                                                                         |
| -------- | --------------------------------------------------------------------------------------------- |
| Severity | High                                                                                          |
| Status   | Open                                                                                          |
| Found    | 2026-11-13, code review                                                                       |
| Evidence | Confirmed                                                                                     |
| Location | `src/application/files/uploadFileCommand.ts:7`, `src/infrastructure/fileStorage/index.ts:1-3` |

## Cause

Four imports use a relative path with no file extension. Node cannot resolve such a path. The old bundler resolved it. The type check does not find the problem, because `tsconfig.json` has `moduleResolution: bundler`.

## Failure scenario

Import `#rest-api/files/index` in Node, or connect `filesApi` in `src/main.ts`. Node stops with `ERR_MODULE_NOT_FOUND` for `src/infrastructure/env`.

## Proposed correction

Use the `#` prefix for these imports, as the other files do.
