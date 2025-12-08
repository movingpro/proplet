import * as assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { fn, NeedleType, transformData } from "./playground.js";

describe("playground", () => {
  describe("transformData", () => {
    describe("condition type", () => {
      it("should successfully parse valid condition data", () => {
        const validData = {
          publicId: 123,
          name: "Test Condition",
        };

        const result = transformData(NeedleType.condition, validData);

        assert.deepEqual(result, validData);
        assert.equal(result.publicId, 123);
        assert.equal(result.name, "Test Condition");
      });

      it("should throw error when publicId is not an integer", () => {
        const invalidData = {
          publicId: 123.45,
          name: "Test",
        };

        assert.throws(() => transformData(NeedleType.condition, invalidData), {
          name: "ZodError",
        });
      });

      it("should throw error when publicId is not a number", () => {
        const invalidData = {
          publicId: "not-a-number",
          name: "Test",
        };

        assert.throws(() => transformData(NeedleType.condition, invalidData), {
          name: "ZodError",
        });
      });

      it("should throw error when name is empty", () => {
        const invalidData = {
          publicId: 1,
          name: "",
        };

        assert.throws(() => transformData(NeedleType.condition, invalidData), {
          name: "ZodError",
        });
      });

      it("should throw error when name exceeds 255 characters", () => {
        const invalidData = {
          publicId: 1,
          name: "a".repeat(256),
        };

        assert.throws(() => transformData(NeedleType.condition, invalidData), {
          name: "ZodError",
        });
      });

      it("should accept name with exactly 255 characters", () => {
        const validData = {
          publicId: 1,
          name: "a".repeat(255),
        };

        const result = transformData(NeedleType.condition, validData);
        assert.equal(result.name.length, 255);
      });

      it("should throw error when required fields are missing", () => {
        const invalidData = {
          publicId: 1,
        };

        assert.throws(() => transformData(NeedleType.condition, invalidData), {
          name: "ZodError",
        });
      });

      it("should throw error when name field is missing", () => {
        const invalidData = {
          publicId: 1,
        };

        assert.throws(() => transformData(NeedleType.condition, invalidData), {
          name: "ZodError",
        });
      });
    });

    describe("location type", () => {
      it("should successfully parse valid location data", () => {
        const validData = {
          publicId: 456,
          secret: "secret-token-123",
        };

        const result = transformData(NeedleType.location, validData);

        assert.deepEqual(result, validData);
        assert.equal(result.publicId, 456);
        assert.equal(result.secret, "secret-token-123");
      });

      it("should throw error when publicId is not an integer", () => {
        const invalidData = {
          publicId: 456.78,
          secret: "secret",
        };

        assert.throws(() => transformData(NeedleType.location, invalidData), {
          name: "ZodError",
        });
      });

      it("should throw error when secret is empty", () => {
        const invalidData = {
          publicId: 1,
          secret: "",
        };

        assert.throws(() => transformData(NeedleType.location, invalidData), {
          name: "ZodError",
        });
      });

      it("should throw error when secret exceeds 255 characters", () => {
        const invalidData = {
          publicId: 1,
          secret: "s".repeat(256),
        };

        assert.throws(() => transformData(NeedleType.location, invalidData), {
          name: "ZodError",
        });
      });

      it("should accept secret with exactly 255 characters", () => {
        const validData = {
          publicId: 1,
          secret: "s".repeat(255),
        };

        const result = transformData(NeedleType.location, validData);
        assert.equal(result.secret.length, 255);
      });

      it("should throw error when secret field is missing", () => {
        const invalidData = {
          publicId: 1,
        };

        assert.throws(() => transformData(NeedleType.location, invalidData), {
          name: "ZodError",
        });
      });
    });

    describe("damageLocation type", () => {
      it("should successfully parse valid damageLocation data", () => {
        const validData = {
          publicId: 789,
          secret: "damage-secret-456",
        };

        const result = transformData(NeedleType.damageLocation, validData);

        assert.deepEqual(result, validData);
        assert.equal(result.publicId, 789);
        assert.equal(result.secret, "damage-secret-456");
      });

      it("should throw error when publicId is not an integer", () => {
        const invalidData = {
          publicId: 789.01,
          secret: "secret",
        };

        assert.throws(
          () => transformData(NeedleType.damageLocation, invalidData),
          {
            name: "ZodError",
          },
        );
      });

      it("should throw error when secret is empty", () => {
        const invalidData = {
          publicId: 1,
          secret: "",
        };

        assert.throws(
          () => transformData(NeedleType.damageLocation, invalidData),
          {
            name: "ZodError",
          },
        );
      });

      it("should throw error when secret exceeds 255 characters", () => {
        const invalidData = {
          publicId: 1,
          secret: "s".repeat(256),
        };

        assert.throws(
          () => transformData(NeedleType.damageLocation, invalidData),
          {
            name: "ZodError",
          },
        );
      });
    });

    describe("edge cases", () => {
      it("should handle negative integers for publicId", () => {
        const validData = {
          publicId: -1,
          name: "Test",
        };

        const result = transformData(NeedleType.condition, validData);
        assert.equal(result.publicId, -1);
      });

      it("should handle zero as publicId", () => {
        const validData = {
          publicId: 0,
          name: "Test",
        };

        const result = transformData(NeedleType.condition, validData);
        assert.equal(result.publicId, 0);
      });

      it("should handle single character name", () => {
        const validData = {
          publicId: 1,
          name: "A",
        };

        const result = transformData(NeedleType.condition, validData);
        assert.equal(result.name, "A");
      });

      it("should throw error for null payload", () => {
        assert.throws(() => transformData(NeedleType.condition, null), {
          name: "ZodError",
        });
      });

      it("should throw error for undefined payload", () => {
        assert.throws(() => transformData(NeedleType.condition, undefined), {
          name: "ZodError",
        });
      });

      it("should throw error for primitive payload", () => {
        assert.throws(() => transformData(NeedleType.condition, "string"), {
          name: "ZodError",
        });
      });

      it("should throw error for array payload", () => {
        assert.throws(() => transformData(NeedleType.condition, []), {
          name: "ZodError",
        });
      });

      it("should handle extra fields in payload (should be stripped by zod)", () => {
        const dataWithExtraFields = {
          publicId: 1,
          name: "Test",
          extraField: "should be ignored",
        };

        const result = transformData(NeedleType.condition, dataWithExtraFields);
        assert.equal(result.publicId, 1);
        assert.equal(result.name, "Test");
        // Extra field should not be in result (Zod strips unknown keys by default)
        assert.equal("extraField" in result, false);
      });
    });
  });

  describe("fn", () => {
    it("should call transformData and return parsed result", () => {
      const validData = {
        publicId: 100,
        name: "Function Test",
      };

      const result = fn(NeedleType.condition, validData);

      assert.deepEqual(result, validData);
    });

    it("should log the parsed data to console", () => {
      const validData = {
        publicId: 200,
        secret: "test-secret",
      };

      // Mock console.log
      const originalLog = console.log;
      const logMock = mock.fn();
      console.log = logMock;

      try {
        fn(NeedleType.location, validData);

        // Verify console.log was called
        assert.equal(logMock.mock.calls.length, 1);
        const firstCall = logMock.mock.calls[0];
        if (firstCall) {
          assert.deepEqual(firstCall.arguments[0], validData);
        }
      } finally {
        // Restore console.log
        console.log = originalLog;
      }
    });

    it("should throw error when transformData fails", () => {
      const invalidData = {
        publicId: "not-a-number",
        name: "Test",
      };

      assert.throws(() => fn(NeedleType.condition, invalidData), {
        name: "ZodError",
      });
    });

    it("should work with all NeedleType values", () => {
      const testCases = [
        {
          type: NeedleType.condition,
          data: { publicId: 1, name: "Test" },
        },
        {
          type: NeedleType.location,
          data: { publicId: 2, secret: "secret1" },
        },
        {
          type: NeedleType.damageLocation,
          data: { publicId: 3, secret: "secret2" },
        },
      ];

      // Mock console.log to avoid output
      const originalLog = console.log;
      console.log = mock.fn();

      try {
        testCases.forEach(({ type, data }) => {
          const result = fn(type, data);
          assert.deepEqual(result, data);
        });
      } finally {
        console.log = originalLog;
      }
    });

    it("should not catch errors from transformData", () => {
      const invalidData = {
        publicId: 1.5,
        name: "Test",
      };

      assert.throws(() => fn(NeedleType.condition, invalidData));
    });
  });

  describe("NeedleType enum", () => {
    it("should have correct enum values", () => {
      assert.equal(NeedleType.condition, 0);
      assert.equal(NeedleType.location, 1);
      assert.equal(NeedleType.damageLocation, 2);
    });

    it("should have three enum members", () => {
      const enumValues = Object.keys(NeedleType).filter((key) =>
        isNaN(Number(key)),
      );
      assert.equal(enumValues.length, 3);
    });
  });

  describe("type safety", () => {
    it("should return correct type for condition", () => {
      const validData = {
        publicId: 1,
        name: "Test",
      };

      const result = transformData(NeedleType.condition, validData);

      // Type assertion to ensure TypeScript inference works
      assert.ok("name" in result);
      assert.ok("publicId" in result);
      // Use type narrowing
      if ("name" in result) {
        assert.equal(typeof result.name, "string");
      }
      assert.equal(typeof result.publicId, "number");
    });

    it("should return correct type for location", () => {
      const validData = {
        publicId: 1,
        secret: "secret",
      };

      const result = transformData(NeedleType.location, validData);

      // Type assertion to ensure TypeScript inference works
      assert.ok("secret" in result);
      assert.ok("publicId" in result);
      if ("secret" in result) {
        assert.equal(typeof result.secret, "string");
      }
      assert.equal(typeof result.publicId, "number");
    });

    it("should return correct type for damageLocation", () => {
      const validData = {
        publicId: 1,
        secret: "damage-secret",
      };

      const result = transformData(NeedleType.damageLocation, validData);

      // Type assertion to ensure TypeScript inference works
      assert.ok("secret" in result);
      assert.ok("publicId" in result);
      if ("secret" in result) {
        assert.equal(typeof result.secret, "string");
      }
      assert.equal(typeof result.publicId, "number");
    });
  });

  describe("integration tests", () => {
    it("should handle complete workflow for condition", () => {
      const input = {
        publicId: 42,
        name: "New Condition",
      };

      const result = fn(NeedleType.condition, input);

      assert.equal(result.publicId, 42);
      if ("name" in result) {
        assert.equal(result.name, "New Condition");
      }
    });

    it("should handle complete workflow for location", () => {
      const input = {
        publicId: 100,
        secret: "location-secret-key",
      };

      // Mock console.log
      const originalLog = console.log;
      console.log = mock.fn();

      try {
        const result = fn(NeedleType.location, input);

        assert.equal(result.publicId, 100);
        if ("secret" in result) {
          assert.equal(result.secret, "location-secret-key");
        }
      } finally {
        console.log = originalLog;
      }
    });

    it("should handle complete workflow for damageLocation", () => {
      const input = {
        publicId: 999,
        secret: "damage-secret-key",
      };

      // Mock console.log
      const originalLog = console.log;
      console.log = mock.fn();

      try {
        const result = fn(NeedleType.damageLocation, input);

        assert.equal(result.publicId, 999);
        if ("secret" in result) {
          assert.equal(result.secret, "damage-secret-key");
        }
      } finally {
        console.log = originalLog;
      }
    });
  });
});
