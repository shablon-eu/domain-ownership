import { createHash } from "node:crypto"

export async function generateKey(domain: string, config?: {
  name?: string
  seed?: string
}) {

  const key = createHash("sha256").update(`_${name}.${domain}:${name}`).digest("hex");


}
