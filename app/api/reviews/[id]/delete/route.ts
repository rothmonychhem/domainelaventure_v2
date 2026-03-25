import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteStoredReview } from "@/lib/reviews";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url), {
      status: 303,
    });
  }

  const { id } = await params;

  try {
    await deleteStoredReview(id);

    return NextResponse.redirect(new URL("/admin/reviews?deleted=1", req.url), {
      status: 303,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete review.";

    return NextResponse.redirect(
      new URL(`/admin/reviews?error=${encodeURIComponent(message)}`, req.url),
      { status: 303 }
    );
  }
}
