import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { importAirbnbReviews } from "@/lib/reviews";

export async function POST(req: Request) {
  const session = await getSession();

  if (!session || session.role !== "owner") {
    return NextResponse.redirect(new URL("/login", req.url), {
      status: 303,
    });
  }

  const formData = await req.formData();
  const rawReviews = String(formData.get("rawReviews") || "");

  try {
    const importedCount = await importAirbnbReviews(rawReviews);

    return NextResponse.redirect(
      new URL(`/admin/reviews?success=1&count=${importedCount}`, req.url),
      { status: 303 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to import reviews.";

    return NextResponse.redirect(
      new URL(`/admin/reviews?error=${encodeURIComponent(message)}`, req.url),
      { status: 303 }
    );
  }
}
