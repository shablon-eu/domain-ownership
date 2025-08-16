import { createHash } from "node:crypto";
import { DEFAULT_NAME, DEFAULT_SEED } from "./defaults.js";
import type { Logger } from "./logger.js";

/**
 * @link https://stackoverflow.com/a/49134699
 */
const domainRegex =
  /^([a-zA-Z0-9]([-a-zA-Z0-9]{0,61}[a-zA-Z0-9])?\.)*([a-zA-Z0-9]{1,2}([-a-zA-Z0-9]{0,252}[a-zA-Z0-9])?)\.([a-zA-Z]{2,63})$/i;

export function generate(
  domain: string,
  config?: {
    name?: string;
    seed?: string;
    logger?: Logger;
  },
) {
  if (!domainRegex.test(domain)) {
    throw new Error("invalid domain");
  }

  if (config?.name && !/^[a-z0-9]+$/.test(config.name)) {
    throw new Error("invalid name, only alphanumeric allowed");
  }

  if (!config?.seed) {
    config?.logger?.warn('default seed is being used - INSECURE')
  }

  if (!config?.name) {
    config?.logger?.warn('default name is being used')
  }

  const value = createHash("sha256")
    .update(
      `_${config?.name ?? DEFAULT_NAME}.${domain}:${config?.seed ?? DEFAULT_SEED}`,
    )
    .digest("hex");

  return {
    dns: `_${config?.name ?? DEFAULT_NAME}.${domain}`,
    wellKnown: `https://${domain}/.well-known/${config?.name ?? DEFAULT_NAME}`,
    value,
  };
}
