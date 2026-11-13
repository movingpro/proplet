# 006: File dates have no time zone

| Field    | Value                            |
| -------- | -------------------------------- |
| Severity | Medium                           |
| Status   | Open                             |
| Found    | 2026-11-13, code review          |
| Evidence | Not confirmed by a test          |
| Location | `migrations/0001_init.sql:32-33` |

## Cause

`createdAt` and `updatedAt` are TEXT from `CURRENT_TIMESTAMP`. The format is `YYYY-MM-DD HH:MM:SS` in UTC, with no zone and a resolution of 1 second. Before, the API returned ISO strings with `Z`.

## Failure scenario

A client runs `new Date(file.createdAt)` on `2026-11-13 10:00:00`. JavaScript reads it as local time, so the time is wrong by the UTC offset. Two uploads in the same second have the same `createdAt`, so pages with LIMIT and OFFSET can repeat or skip a row.

## Proposed correction

Store ISO 8601 text with `Z` and milliseconds, for example `strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`. Add `id` as the second sort column.
