import { describe, expect, test, vi } from "vitest";
import { generate } from "./generate.js";
import { DEFAULT_NAME, DEFAULT_SEED } from "./defaults.js";
import { createHash } from "node:crypto";

describe("generate", () => {
  test("invalid domain", () => {
    expect(() => generate("55")).toThrowError("invalid domain");
  });

  test("generates deterministic value and records with defaults", () => {
    const domain = "example.com";
    const res = generate(domain);

    const expectedValue = createHash("sha256")
      .update(`_${DEFAULT_NAME}.${domain}:${DEFAULT_SEED}`)
      .digest("hex");

    expect(res.value).toBe(expectedValue);
    expect(res.dns).toBe(`_${DEFAULT_NAME}.${domain}`);
    expect(res.wellKnown).toBe(`https://${domain}/.well-known/${DEFAULT_NAME}`);
  });

  test("uses custom name and seed in hash and records", () => {
    const domain = "www.example.com";
    const name = "customname";
    const seed = "s3cr3t";

    const res = generate(domain, { name, seed });

    const expectedValue = createHash("sha256")
      .update(`_${name}.${domain}:${seed}`)
      .digest("hex");

    expect(res.value).toBe(expectedValue);
    expect(res.dns).toBe(`_${name}.${domain}`);
    expect(res.wellKnown).toBe(`https://${domain}/.well-known/${name}`);
  });

  test("invalid name (non-lowercase alphanumeric) throws", () => {
    expect(() => generate("example.com", { name: "UPPER" })).toThrow(
      "invalid name, only alphanumeric allowed",
    );
    expect(() => generate("example.com", { name: "my-name" })).toThrow(
      "invalid name, only alphanumeric allowed",
    );
    expect(() => generate("example.com", { name: "with space" })).toThrow(
      "invalid name, only alphanumeric allowed",
    );
  });

  test("logger warns when default name/seed are used", () => {
    const warn = vi.fn();
    const logger = { warn, error: vi.fn() };

    // both defaults used -> expect two warns
    generate("example.com", { logger });
    expect(warn).toHaveBeenCalledWith("default seed is being used - INSECURE");
    expect(warn).toHaveBeenCalledWith("default name is being used");

    warn.mockClear();

    // only default seed used -> one warn
    generate("example.com", { name: "abc123", logger });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith("default seed is being used - INSECURE");

    warn.mockClear();

    // only default name used -> one warn
    generate("example.com", { seed: "seed", logger });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith("default name is being used");
  });
});
