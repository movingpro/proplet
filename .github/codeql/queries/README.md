# Custom CodeQL Queries

This directory contains custom CodeQL queries for the Proplet project.

## Queries

### no-console-log.ql

Detects `console.log()` statements in the codebase.

- **ID**: `js/console-log`
- **Severity**: Warning
- **Description**: Identifies console.log statements that should be removed before production deployment

### no-console.ql

Detects all console method calls in the codebase.

- **ID**: `js/console-statement`
- **Severity**: Warning
- **Description**: Identifies any console method calls (log, warn, error, info, debug, etc.) that should be removed before production deployment

This query catches:
- `console.log()`
- `console.warn()`
- `console.error()`
- `console.info()`
- `console.debug()`
- `console.trace()`
- `console.dir()`
- `console.dirxml()`
- `console.table()`
- `console.group()`
- `console.groupCollapsed()`
- `console.groupEnd()`
- `console.clear()`
- `console.count()`
- `console.countReset()`
- `console.assert()`
- `console.profile()`
- `console.profileEnd()`
- `console.time()`
- `console.timeLog()`
- `console.timeEnd()`
- `console.timeStamp()`

## Usage

These queries are automatically included in the CodeQL analysis through the configuration file at `.github/codeql/codeql-config.yml`.

### Running Locally

To run these queries locally with the CodeQL CLI:

```bash
# Install CodeQL CLI first
# https://github.com/github/codeql-cli-binaries

# Create a CodeQL database
codeql database create proplet-db --language=javascript

# Run the custom queries
codeql database analyze proplet-db .github/codeql/queries --format=sarif-latest --output=results.sarif

# View results
codeql bqrs decode results.sarif --format=text
```

### GitHub Actions

The queries run automatically on:
- Push to `main` branch
- Pull requests to `main` branch
- Weekly schedule (Fridays at 8:17 AM)

Results appear in the **Security** tab under **Code scanning alerts**.

## Customization

### Excluding Specific Files

To exclude files from these queries, update the `paths-ignore` section in `.github/codeql/codeql-config.yml`:

```yaml
paths-ignore:
  - node_modules
  - dist
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "**/__tests__/**"
```

### Allowing Console in Development

If you want to allow console statements in certain development files, you can:

1. Use path exclusions in the config
2. Add inline suppressions:

```javascript
// codeql[js/console-log]
console.log("This is allowed");
```

### Changing Severity

Edit the `@problem.severity` annotation in the query file:
- `error` - Blocks CI/CD
- `warning` - Shows warning (default)
- `recommendation` - Advisory only

## Best Practices

1. **Remove console statements before production**: Console statements can expose sensitive information and impact performance
2. **Use proper logging libraries**: Consider using structured logging libraries like Winston, Pino, or Bunyan for production code
3. **Use debugger tools**: Use browser DevTools breakpoints instead of console.log for debugging

## References

- [CodeQL Documentation](https://codeql.github.com/docs/)
- [JavaScript CodeQL Library](https://codeql.github.com/codeql-standard-libraries/javascript/)
- [Writing Custom Queries](https://codeql.github.com/docs/writing-codeql-queries/)