# 005: `%` and `_` in the file search act as wildcards

| Field    | Value                                        |
| -------- | -------------------------------------------- |
| Severity | Low                                          |
| Status   | Open                                         |
| Found    | 2026-11-13, code review                      |
| Evidence | Not confirmed by a test                      |
| Location | `src/application/files/listFilesQuery.ts:21` |

## Cause

The search text goes into the LIKE pattern without an escape for `%` and `_`.

## Failure scenario

Send `GET /files?search=a_b`. The reply also has files with `axb` in the name. `files` and `total` both include rows that do not contain the literal text.

## Proposed correction

Escape `%`, `_` and the escape character in the search text, and add `ESCAPE` to the LIKE clause.
