import fetch from "node-fetch";
import { generate } from "./generate.js";

export async function verifyWellKnown(
  domain: string,
  config?: { seed?: string; name?: string },
) {
  const { value, wellKnown } = generate(domain, config);

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
}
