# 002: An empty array deletes all rows of the tenant

| Field    | Value                                                                                                            |
| -------- | ---------------------------------------------------------------------------------------------------------------- |
| Severity | High                                                                                                             |
| Status   | Open                                                                                                             |
| Found    | 2026-11-13, code review                                                                                          |
| Evidence | Not confirmed by a test                                                                                          |
| Location | `src/application/conditions/saveConditionsCommand.ts:16`, `src/application/locations/saveLocationsCommand.ts:16` |

## Cause

The command sends a DELETE and then one INSERT for each row. With an empty array, the batch has only the DELETE. Before, Drizzle threw an error on an empty insert and the DELETE rolled back.

## Failure scenario

Send `POST /locations` with the body `[]`. All locations of the tenant are removed. The reply is 200 with "saved successfully".

## Proposed correction

Decide if an empty array is a valid request. If not, reject it with `.min(1)` in the Zod schema.
