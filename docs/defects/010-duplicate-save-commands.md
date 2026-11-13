# 010: `saveLocationsCommand` is a copy of `saveConditionsCommand`

| Field    | Value                                                                                                                                          |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Severity | Low                                                                                                                                            |
| Status   | Open                                                                                                                                           |
| Found    | 2026-11-13, code review                                                                                                                        |
| Evidence | Confirmed                                                                                                                                      |
| Location | `src/application/conditions/saveConditionsCommand.ts`, `src/application/locations/saveLocationsCommand.ts`, and the two `get...Query.ts` files |

## Cause

Only the table name is different. The `Condition` and `Location` types are also the same. Each command sends one INSERT statement for each row.

## Failure scenario

Change the validation in one file and not in the other: the two routes then accept different data. Send a POST with some thousand rows: Node runs one statement for each row in a synchronous loop and blocks other requests. D1 gets a very large batch.

## Proposed correction

Use one shared function with the table name as a parameter, and a multi-row INSERT in chunks.
