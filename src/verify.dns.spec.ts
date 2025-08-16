import { beforeEach, describe, expect, test, vi } from "vitest";
import { generate } from "./generate.js";
import { verifyDns } from "./verify.dns.js";

// Set up a mutable mock for resolveTxt once for the file
const resolveTxtMock = vi.fn();
vi.mock("node:dns/promises", () => ({
  resolveTxt: (...args: any[]) => resolveTxtMock(...args),
}));

describe("verifyDns", () => {
  const config = { name: "verify", seed: "seed" } as const;

  let error: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    resolveTxtMock.mockReset();
    error = vi.fn();
  });

  test("returns true when TXT record includes value", async () => {
    const domain = "example.com";
    const { value } = generate(domain, config);
    resolveTxtMock.mockResolvedValue([[value]]);

    const result = await verifyDns(domain, config);
    expect(result).toBe(true);
  });

  test("returns true when TXT record includes value for sub domain", async () => {
    const domain = "sub.example.com";
    const { value } = generate(domain, config);
    resolveTxtMock.mockResolvedValue([[value]]);

    const result = await verifyDns(domain, config);
    expect(result).toBe(true);
  });

  test("returns true when TXT record includes value for sub sub domain", async () => {
    const domain = "sub.sub.example.com";
    const { value } = generate(domain, config);
    resolveTxtMock.mockResolvedValue([[value]]);

    const result = await verifyDns(domain, config);
    expect(result).toBe(true);
  });

  test("returns false when TXT record does not include value", async () => {
    const domain = "example.com";
    resolveTxtMock.mockResolvedValue([["other"], ["values"]]);

    const result = await verifyDns(domain, config);
    expect(result).toBe(false);
  });

  test("logs error and returns false on DNS error", async () => {
    const domain = "example.com";
    const logger = { warn: vi.fn(), error };
    resolveTxtMock.mockRejectedValue(new Error("boom"));

    const result = await verifyDns(domain, { ...config, logger });
    expect(result).toBe(false);
    expect(error).toHaveBeenCalled();
  });
});
