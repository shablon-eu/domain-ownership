import { describe, expect, test, vi, beforeEach } from "vitest";
import { verifyWellKnown } from "./verify.well.known.js";
import { generate } from "./generate.js";

// Set up a mutable mock for fetch once for the file
const fetchMock = vi.fn();
vi.mock("node-fetch", () => ({
  default: (...args: any[]) => fetchMock(...args),
}));

describe("verifyWellKnown", () => {
  const domain = "example.com";
  const config = { name: "verify", seed: "seed" } as const;

  let error: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock.mockReset();
    error = vi.fn();
  });

  test("returns true when fetch returns exact value", async () => {
    const { value } = generate(domain, config);

    const text = vi.fn().mockResolvedValue(value);

    fetchMock.mockResolvedValue({ ok: true, text });

    const result = await verifyWellKnown(domain, config);
    expect(result).toBe(true);
    // Ensure text() was called
    expect(text).toHaveBeenCalled();
  });

  test("returns false when response not ok", async () => {
    fetchMock.mockResolvedValue({ ok: false, text: vi.fn() });

    const result = await verifyWellKnown(domain, config);
    expect(result).toBe(false);
  });

  test("returns false when body mismatch", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue("nope"),
    });

    const result = await verifyWellKnown(domain, config);
    expect(result).toBe(false);
  });

  test("logs error and returns false on fetch error", async () => {
    const logger = { warn: vi.fn(), error };
    fetchMock.mockRejectedValue(new Error("boom"));

    const result = await verifyWellKnown(domain, { ...config, logger });
    expect(result).toBe(false);
    expect(error).toHaveBeenCalled();
  });
});
