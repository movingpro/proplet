# Defects

Findings of the code review of 2026-11-13. Each defect has its own file.

| ID                                                | Defect                                                           | Severity | Status |
| ------------------------------------------------- | ---------------------------------------------------------------- | -------- | ------ |
| [001](001-files-api-does-not-load-on-node.md)     | The files API does not load on Node                              | High     | Open   |
| [002](002-empty-array-deletes-all-rows.md)        | An empty array deletes all rows of the tenant                    | High     | Open   |
| [003](003-migrate-ignores-database-path.md)       | `pnpm migrate` ignores `DATABASE_PATH`                           | Medium   | Open   |
| [004](004-negative-limit-turns-off-pagination.md) | A negative `limit` turns off pagination                          | Medium   | Open   |
| [005](005-like-wildcards-in-file-search.md)       | `%` and `_` in the file search act as wildcards                  | Low      | Open   |
| [006](006-file-dates-have-no-time-zone.md)        | File dates have no time zone                                     | Medium   | Open   |
| [007](007-invalid-body-returns-500.md)            | An invalid body returns 500, not 400                             | Medium   | Open   |
| [008](008-sigint-can-hang.md)                     | Ctrl-C can hang and the database is not closed                   | Low      | Open   |
| [009](009-d1-config-and-migrations.md)            | The D1 configuration is not complete and the databases can drift | Medium   | Open   |
| [010](010-duplicate-save-commands.md)             | `saveLocationsCommand` is a copy of `saveConditionsCommand`      | Low      | Open   |
