import { resolveTxt } from "node:dns/promises";
import { generate } from "./generate.js";

export async function verifyDns(
  domain: string,
  config?: {
    seed?: string;
    name?: string;
  },
) {
  const { value, dns } = generate(domain, config);

  try {
    const txt = await resolveTxt(dns);

    if (txt.flat().includes(value)) {
      return true;
    }
  } catch (e) {
    console.error("unexpected error verifying dns", e);
  }

  return false;
}
