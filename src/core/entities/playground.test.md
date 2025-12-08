# Playground Test Documentation

This document describes the test coverage for `playground.ts` using Node.js built-in test runner.

## Overview

The test suite provides comprehensive coverage for the playground module, which demonstrates type-safe schema validation using Zod with TypeScript's generic type inference.

## Test Statistics

- **Total Tests**: 39
- **Test Suites**: 10
- **Coverage Areas**: Schema validation, type safety, error handling, edge cases, integration

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test:watch
```

### Run specific test file
```bash
npx tsx --test src/core/entities/playground.spec.ts
```

## Test Structure

### 1. `transformData` Function Tests

#### 1.1 Condition Type Tests (8 tests)
Tests validation for the `condition` schema which requires:
- `publicId`: integer
- `name`: string (1-255 characters)

**Covered scenarios:**
- ✅ Valid condition data parsing
- ✅ Non-integer publicId rejection
- ✅ Non-number publicId rejection
- ✅ Empty name rejection
- ✅ Name exceeding 255 characters rejection
- ✅ Exactly 255 character name acceptance
- ✅ Missing required fields rejection
- ✅ Missing name field rejection

#### 1.2 Location Type Tests (6 tests)
Tests validation for the `location` schema which requires:
- `publicId`: integer
- `secret`: string (1-255 characters)

**Covered scenarios:**
- ✅ Valid location data parsing
- ✅ Non-integer publicId rejection
- ✅ Empty secret rejection
- ✅ Secret exceeding 255 characters rejection
- ✅ Exactly 255 character secret acceptance
- ✅ Missing secret field rejection

#### 1.3 Damage Location Type Tests (4 tests)
Tests validation for the `damageLocation` schema (same structure as location).

**Covered scenarios:**
- ✅ Valid damageLocation data parsing
- ✅ Non-integer publicId rejection
- ✅ Empty secret rejection
- ✅ Secret exceeding 255 characters rejection

#### 1.4 Edge Cases Tests (8 tests)
Tests boundary conditions and unusual inputs.

**Covered scenarios:**
- ✅ Negative integers for publicId
- ✅ Zero as publicId
- ✅ Single character strings
- ✅ Null payload rejection
- ✅ Undefined payload rejection
- ✅ Primitive (non-object) payload rejection
- ✅ Array payload rejection
- ✅ Extra fields handling (Zod strips unknown keys)

### 2. `fn` Function Tests (5 tests)

Tests the main function that combines transformation with console logging.

**Covered scenarios:**
- ✅ Successful transformation and return
- ✅ Console.log invocation verification
- ✅ Error propagation from transformData
- ✅ Support for all NeedleType enum values
- ✅ Error pass-through (no error catching)

### 3. `NeedleType` Enum Tests (2 tests)

Tests the enum structure and values.

**Covered scenarios:**
- ✅ Correct numeric values (0, 1, 2)
- ✅ Exactly three enum members

### 4. Type Safety Tests (3 tests)

Tests TypeScript type inference and runtime type checking.

**Covered scenarios:**
- ✅ Correct return type for condition
- ✅ Correct return type for location
- ✅ Correct return type for damageLocation

### 5. Integration Tests (3 tests)

Tests complete workflows from input to output.

**Covered scenarios:**
- ✅ Complete workflow for condition type
- ✅ Complete workflow for location type
- ✅ Complete workflow for damageLocation type

## Key Testing Patterns

### 1. Zod Error Validation
```typescript
assert.throws(() => transformData(NeedleType.condition, invalidData), {
  name: "ZodError",
});
```

### 2. Console.log Mocking
```typescript
const originalLog = console.log;
const logMock = mock.fn();
console.log = logMock;

try {
  fn(NeedleType.location, validData);
  assert.equal(logMock.mock.calls.length, 1);
} finally {
  console.log = originalLog;
}
```

### 3. Deep Equality Assertions
```typescript
assert.deepEqual(result, expectedValue);
```

### 4. Type Checking at Runtime
```typescript
assert.ok("name" in result);
assert.equal(typeof result.name, "string");
```

## Schema Validation Rules

### Condition Schema
```typescript
{
  publicId: number (integer),
  name: string (1-255 chars)
}
```

### Location Schema
```typescript
{
  publicId: number (integer),
  secret: string (1-255 chars)
}
```

### Damage Location Schema
```typescript
{
  publicId: number (integer),
  secret: string (1-255 chars)
}
```

## Common Test Data Examples

### Valid Condition
```typescript
{
  publicId: 123,
  name: "Test Condition"
}
```

### Valid Location
```typescript
{
  publicId: 456,
  secret: "secret-token-123"
}
```

### Invalid Examples
```typescript
// Float instead of integer
{ publicId: 123.45, name: "Test" }

// Empty string
{ publicId: 1, name: "" }

// Too long string
{ publicId: 1, name: "a".repeat(256) }

// Missing field
{ publicId: 1 }

// Wrong type
{ publicId: "not-a-number", name: "Test" }
```

## Error Handling

All validation errors throw `ZodError` with descriptive messages. The tests verify:
1. Errors are thrown for invalid data
2. Error types match expected (`ZodError`)
3. Valid data passes without errors
4. Edge cases are handled correctly

## Test Dependencies

- **Node.js Test Runner**: Built-in testing framework (Node 20+)
- **tsx**: TypeScript execution and testing
- **Zod**: Schema validation library
- **Node Assert**: Assertion library (strict mode)

## Future Enhancements

Consider adding tests for:
- [ ] Performance benchmarks for large datasets
- [ ] Concurrent validation scenarios
- [ ] Custom error message validation
- [ ] Schema composition tests
- [ ] Async validation scenarios
- [ ] Internationalization (i18n) support

## Notes

- All tests use strict assertion mode (`node:assert/strict`)
- Console.log calls are mocked to prevent test output pollution
- Tests are isolated and can run in any order
- TypeScript provides compile-time type safety, tests verify runtime behavior
- Zod automatically strips unknown keys from validated objects