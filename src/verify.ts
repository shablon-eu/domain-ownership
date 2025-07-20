import { verifyDns } from "./verify.dns.js";
import { verifyWellKnown } from "./verify.well.known.js";

export async function verify(
  domain: string,
  config?: {
    seed?: string;
    name?: string;
  },
) {
  const results = await Promise.all([
    verifyDns(domain, config),
    verifyWellKnown(domain, config),
  ]);

  return results.some((t) => t);
}
