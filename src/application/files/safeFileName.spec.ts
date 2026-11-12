import assert from "node:assert/strict";
import { test } from "node:test";

import { safeFileName } from "#application/files/safeFileName";

await test("safeFileName removes directories and rejects empty names", () => {
  assert.equal(safeFileName("report.pdf"), "report.pdf");
  assert.equal(safeFileName("../../tenant/id/report.pdf"), "report.pdf");
  assert.equal(safeFileName("..\\..\\report.pdf"), "report.pdf");

  for (const name of ["", "..", "a/..", "/"]) {
    assert.throws(() => safeFileName(name), /Invalid file name/);
  }
});
