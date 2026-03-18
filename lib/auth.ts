import crypto from "crypto";
import { cookies } from "next/headers";

type Role = "owner" | "dev";

function getSecret() {
  return process.env.SESSION_SECRET || "dev-secret";
}

export function signSession(payload: { email: string; role: Role }) {
  const json = JSON.stringify(payload);
  const base = Buffer.from(json).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(base)
    .digest("base64url");

  return `${base}.${sig}`;
}

export function verifySession(token: string | undefined | null) {
  if (!token) return null;

  const [base, sig] = token.split(".");
  if (!base || !sig) return null;

  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(base)
    .digest("base64url");

  if (expected !== sig) return null;

  try {
    return JSON.parse(Buffer.from(base, "base64url").toString("utf8")) as {
      email: string;
      role: Role;
    };
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  const token = store.get("session")?.value;
  return verifySession(token);
}