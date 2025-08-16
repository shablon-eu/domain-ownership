import { resolveTxt } from "node:dns/promises"
import { generate } from "./generate.js"
import type { Logger } from "./logger.js"

export async function verifyDns(
  domain: string,
  config?: {
    seed?: string;
    name?: string;
    logger?: Logger;
  },
) {
  const { value, dns } = generate(domain, config);

  try {
    const txt = await resolveTxt(dns);

    if (txt.flat().includes(value)) {
      return true;
    }
  } catch (error) {
    config?.logger?.error("unexpected error verifying dns", error);
  }

  return false;
}
