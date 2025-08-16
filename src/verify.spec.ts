import { describe, expect, test, vi, beforeEach } from "vitest";
import { verify } from "./verify.js";

vi.mock("./verify.dns.js", () => ({ verifyDns: vi.fn() }));
vi.mock("./verify.well.known.js", () => ({ verifyWellKnown: vi.fn() }));

// Import after mocks so that verify picks up mocked deps
import { verifyDns } from "./verify.dns.js";
import { verifyWellKnown } from "./verify.well.known.js";

describe("verify (combines DNS and well-known)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns true when DNS true, WK false", async () => {
    (verifyDns as any).mockResolvedValue(true);
    (verifyWellKnown as any).mockResolvedValue(false);

    const res = await verify("example.com");
    expect(res).toBe(true);
  });

  test("returns true when DNS false, WK true", async () => {
    (verifyDns as any).mockResolvedValue(false);
    (verifyWellKnown as any).mockResolvedValue(true);

    const res = await verify("example.com");
    expect(res).toBe(true);
  });

  test("returns false when both verifiers return false", async () => {
    (verifyDns as any).mockResolvedValue(false);
    (verifyWellKnown as any).mockResolvedValue(false);

    const res = await verify("example.com");
    expect(res).toBe(false);
  });
});
