# 008: Ctrl-C can hang and the database is not closed

| Field    | Value                    |
| -------- | ------------------------ |
| Severity | Low                      |
| Status   | Open                     |
| Found    | 2026-11-13, code review  |
| Evidence | Not confirmed by a test  |
| Location | `src/node-handler.ts:16` |

## Cause

On SIGINT and SIGTERM, the handler waits for the `server.close` callback before exit. The callback does not come while a connection is open. The SQLite database is never closed. The old handler exited immediately on SIGINT and closed the database client.

## Failure scenario

Press Ctrl-C while a client holds a connection open. The process stays alive. Press Ctrl-C again. A second `close` fails with `ERR_SERVER_NOT_RUNNING` and the process exits with code 1.

## Proposed correction

Close idle connections with `server.closeIdleConnections()`, close the database, and ignore a second signal.
