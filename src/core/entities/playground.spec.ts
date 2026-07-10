import * as assert from "node:assert/strict";
import { describe, it } from "node:test";

import { NeedleType, transformData } from "#core/entities/playground";

/* oxlint-disable typescript/no-floating-promises */
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

        assert.throws(() => transformData(NeedleType.damageLocation, invalidData), {
          name: "ZodError",
        });
      });

      it("should throw error when secret is empty", () => {
        const invalidData = {
          publicId: 1,
          secret: "",
        };

        assert.throws(() => transformData(NeedleType.damageLocation, invalidData), {
          name: "ZodError",
        });
      });

      it("should throw error when secret exceeds 255 characters", () => {
        const invalidData = {
          publicId: 1,
          secret: "s".repeat(256),
        };

        assert.throws(() => transformData(NeedleType.damageLocation, invalidData), {
          name: "ZodError",
        });
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

  describe("NeedleType enum", () => {
    it("should have correct enum values", () => {
      assert.equal(NeedleType.condition, 0);
      assert.equal(NeedleType.location, 1);
      assert.equal(NeedleType.damageLocation, 2);
    });

    it("should have three enum members", () => {
      const enumValues = Object.keys(NeedleType).filter((key) => isNaN(Number(key)));
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
});
