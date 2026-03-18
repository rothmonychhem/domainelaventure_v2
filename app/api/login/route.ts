import { NextResponse } from "next/server";
import { signSession } from "@/lib/auth";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const ownerEmail = process.env.OWNER_EMAIL || "";
  const ownerPassword = process.env.OWNER_PASSWORD || "";
  const devEmail = process.env.DEV_EMAIL || "";
  const devPassword = process.env.DEV_PASSWORD || "";

  let role: "owner" | "dev" | null = null;

  if (email === ownerEmail && password === ownerPassword) role = "owner";
  if (email === devEmail && password === devPassword) role = "dev";

  if (!role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const token = signSession({ email, role });
  const res = NextResponse.redirect(new URL("/admin", req.url));
  res.cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res;
}