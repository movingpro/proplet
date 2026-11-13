# 007: An invalid body returns 500, not 400

| Field    | Value                                                                                                            |
| -------- | ---------------------------------------------------------------------------------------------------------------- |
| Severity | Medium                                                                                                           |
| Status   | Open                                                                                                             |
| Found    | 2026-11-13, code review                                                                                          |
| Evidence | Confirmed                                                                                                        |
| Location | `src/application/conditions/saveConditionsCommand.ts:18`, `src/application/locations/saveLocationsCommand.ts:18` |

## Cause

`schema.parse(data)` throws a `ZodError`. No handler maps it, so the default Hono error handler replies.

## Failure scenario

Send `POST /conditions` with the body `[{"publicId":"x"}]`. The reply is 500 with no validation detail. The log shows a server fault for a client error.

## Proposed correction

Add `app.onError` in `src/main.ts` that returns 400 with the Zod message for a `ZodError`.
