import fetch from "node-fetch";
import { generate } from "./generate.js";
import type { Logger } from "./logger.js";

export async function verifyWellKnown(
  domain: string,
  config?: { seed?: string; name?: string; logger?: Logger },
) {
  const { value, wellKnown } = generate(domain, config);

  try {
    const response = await fetch(wellKnown, {
      method: "GET",
      redirect: "error",
      signal: AbortSignal.timeout(500),
    });

    if (!response.ok) {
      return false;
    }

    const text = await response.text();

    return text.trim() === value;
  } catch (error) {
    config?.logger?.error("unexpected error verifying well known", error);
  }

  return false;
}
