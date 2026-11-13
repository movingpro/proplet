# 003: `pnpm migrate` ignores `DATABASE_PATH`

| Field    | Value                   |
| -------- | ----------------------- |
| Severity | Medium                  |
| Status   | Open                    |
| Found    | 2026-11-13, code review |
| Evidence | Not confirmed by a test |
| Location | `package.json:22`       |

## Cause

The `migrate` script always writes `proplet.sqlite`. The server opens the file from `DATABASE_PATH`. `node:sqlite` creates a missing file without a warning. There is no check at startup.

## Failure scenario

Set `DATABASE_PATH=/data/app.sqlite`. Run `pnpm migrate` and then `pnpm start`. The migration goes to `./proplet.sqlite`. The server creates an empty `/data/app.sqlite`. Each request fails with 500 and "no such table: Condition".

## Proposed correction

Make the script use `DATABASE_PATH`, or replace it with a Node migration script that reads `env`.
