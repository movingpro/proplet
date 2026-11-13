# 009: The D1 configuration is not complete and the databases can drift

| Field    | Value                                  |
| -------- | -------------------------------------- |
| Severity | Medium                                 |
| Status   | Open                                   |
| Found    | 2026-11-13, code review                |
| Evidence | Not confirmed by a test                |
| Location | `wrangler.jsonc:26`, `package.json:22` |

## Cause

`database_id` is empty in `wrangler.jsonc`. D1 records which migrations it applied. The Node database has no such record: `pnpm migrate` applies only `0001_init.sql` and fails on an existing file.

## Failure scenario

Run `wrangler deploy`. It fails on the empty `database_id`. Later, add `migrations/0002`. D1 applies it. The Node database must be changed by hand and can miss the migration.

## Proposed correction

Set `database_id` after `wrangler d1 create`. Add a Node migration script that records the applied files, for example with `PRAGMA user_version`.
