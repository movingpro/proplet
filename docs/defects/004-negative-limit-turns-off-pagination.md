# 004: A negative `limit` turns off pagination

| Field    | Value                                                                       |
| -------- | --------------------------------------------------------------------------- |
| Severity | Medium                                                                      |
| Status   | Open                                                                        |
| Found    | 2026-11-13, code review                                                     |
| Evidence | Not confirmed by a test                                                     |
| Location | `src/application/files/listFilesQuery.ts:24`, `src/rest-api/files/index.ts` |

## Cause

The route reads `limit` and `offset` with `parseInt` and does not check them. SQLite reads a negative LIMIT as no limit. PostgreSQL rejected it.

## Failure scenario

Send `GET /files?limit=-1`. The reply has every file row of the tenant. Send `GET /files?limit=abc`. `parseInt` gives NaN, which binds as NULL, and the reply is 500.

## Proposed correction

Validate `limit` and `offset` in the route: integers, `limit` from 1 to a maximum, `offset` 0 or more.
