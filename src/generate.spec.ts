import { describe, expect, test } from "vitest";
import { generate } from "./generate.js";

describe("generate", () => {
  test("invalid domain", () => {
    expect(() => generate("55")).toThrowError("invalid domain");
  });
});
