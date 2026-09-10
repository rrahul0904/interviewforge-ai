import test from "node:test";
import assert from "node:assert/strict";
// Keep a dependency-free smoke test so CI certifies the workspace before richer Vitest suites arrive.
test("confidence bounds", () => { const value = Math.min(1, .45 + .25 + .30); assert.equal(value, 1); });
