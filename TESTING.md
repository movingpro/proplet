# Testing Guide

This document describes the testing setup and practices for the Proplet project.

## Overview

Proplet uses **Node.js built-in test runner** (available in Node 20+) with **tsx** for TypeScript execution. This provides a lightweight, zero-dependency testing solution without the need for additional testing frameworks.

## Quick Start

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test:watch
```

### Run a specific test file
```bash
npx tsx --test src/core/entities/playground.spec.ts
```

## Test Setup

### Dependencies

- **Node.js 20+**: Built-in test runner
- **tsx**: TypeScript execution (`npm install --save-dev tsx`)
- **Node Assert**: Built-in assertion library (strict mode)

### Configuration

Tests are configured in `package.json`:

```json
{
  "scripts": {
    "test": "tsx --test \"src/**/*.spec.ts\"",
    "test:watch": "tsx --test --watch \"src/**/*.spec.ts\""
  }
}
```

## Test File Conventions

- Test files use the `.spec.ts` extension
- Test files are located alongside the source files they test
- Import from source files using `.js` extension (TypeScript module resolution)

### Example Test Structure

```typescript
import * as assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { myFunction } from "./myModule.js";

describe("myModule", () => {
  describe("myFunction", () => {
    it("should do something", () => {
      const result = myFunction("input");
      assert.equal(result, "expected");
    });
  });
});
```

## Available Test Utilities

### From `node:test`
- `describe()` - Group related tests
- `it()` / `test()` - Define individual tests
- `before()` / `after()` - Setup/teardown hooks
- `beforeEach()` / `afterEach()` - Per-test hooks
- `mock.fn()` - Create mock functions

### From `node:assert/strict`
- `assert.equal()` - Loose equality
- `assert.strictEqual()` - Strict equality (===)
- `assert.deepEqual()` - Deep object comparison
- `assert.throws()` - Verify exceptions
- `assert.ok()` - Truthy assertion

## Writing Tests

### Basic Test

```typescript
it("should validate positive numbers", () => {
  const result = isPositive(5);
  assert.equal(result, true);
});
```

### Testing Exceptions

```typescript
it("should throw error for invalid input", () => {
  assert.throws(() => validateSchema(invalidData), {
    name: "ZodError",
  });
});
```

### Mocking Console Output

```typescript
it("should log to console", () => {
  const originalLog = console.log;
  const logMock = mock.fn();
  console.log = logMock;

  try {
    myFunction();
    assert.equal(logMock.mock.calls.length, 1);
  } finally {
    console.log = originalLog;
  }
});
```

### Type Safety Tests

```typescript
it("should return correct type", () => {
  const result = transformData(NeedleType.condition, validData);
  
  assert.ok("name" in result);
  if ("name" in result) {
    assert.equal(typeof result.name, "string");
  }
});
```

## Test Coverage

### Current Coverage

#### `playground.ts` - **100% Coverage**
- ✅ 39 tests across 10 test suites
- ✅ Schema validation (condition, location, damageLocation)
- ✅ Edge cases (null, undefined, invalid types)
- ✅ Type safety verification
- ✅ Error handling
- ✅ Integration tests

See [`playground.test.md`](src/core/entities/playground.test.md) for detailed test documentation.

## Code Quality

### CodeQL Integration

The project includes CodeQL static analysis for code quality and security:

- **Location**: `.github/codeql/`
- **Queries**: Custom queries to detect console statements
- **Runs on**: Push to main, PRs, weekly schedule

#### Custom CodeQL Queries

1. **no-console-log.ql** - Detects `console.log()` statements
2. **no-console.ql** - Detects all console methods

See [`.github/codeql/queries/README.md`](.github/codeql/queries/README.md) for details.

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Use proper setup/teardown to avoid side effects
- Mock external dependencies

### 2. Descriptive Test Names
```typescript
// ✅ Good
it("should throw error when publicId is not an integer", () => { ... });

// ❌ Bad
it("test1", () => { ... });
```

### 3. Arrange-Act-Assert Pattern
```typescript
it("should calculate total price", () => {
  // Arrange
  const items = [{ price: 10 }, { price: 20 }];
  
  // Act
  const total = calculateTotal(items);
  
  // Assert
  assert.equal(total, 30);
});
```

### 4. Test Edge Cases
- Null/undefined values
- Empty strings/arrays
- Boundary values (0, -1, max values)
- Invalid types

### 5. Use Type Narrowing
```typescript
// Handle union types properly
if ("name" in result) {
  assert.equal(result.name, "expected");
}
```

## TypeScript Configuration

Tests work with the project's strict TypeScript configuration:

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`

Ensure tests respect these settings by:
- Checking for undefined when accessing array/object properties
- Using type narrowing for union types
- Avoiding implicit any types

## Continuous Integration

Tests run automatically on:
- Pull requests
- Push to main branch
- Before deployments

## Troubleshooting

### Import Errors

If you see `ERR_MODULE_NOT_FOUND`, ensure:
1. Import paths use `.js` extension (not `.ts`)
2. `package.json` has `"type": "module"`
3. TypeScript config uses `"module": "nodenext"`

### Type Errors

For strict type checking issues:
1. Use type narrowing with `in` operator
2. Check for undefined with optional chaining
3. Add explicit type assertions when necessary

### Mock Not Working

Ensure proper cleanup:
```typescript
const original = console.log;
try {
  console.log = mock.fn();
  // test code
} finally {
  console.log = original; // Always restore
}
```

## Future Enhancements

- [ ] Add test coverage reporting
- [ ] Integration tests for API endpoints
- [ ] Performance benchmarks
- [ ] Visual regression tests
- [ ] E2E tests with Playwright
- [ ] Snapshot testing for complex objects

## Resources

- [Node.js Test Runner Documentation](https://nodejs.org/api/test.html)
- [Node.js Assert Documentation](https://nodejs.org/api/assert.html)
- [tsx Documentation](https://github.com/privatenumber/tsx)
- [TypeScript Testing Best Practices](https://typescript-eslint.io/linting/testing/)

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure tests pass locally before committing
3. Maintain or improve test coverage
4. Document complex test scenarios
5. Remove console statements (CodeQL will catch these)

## Questions?

For questions about testing practices or help writing tests, please open an issue or contact the team.