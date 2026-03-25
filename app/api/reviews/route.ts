import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createPublicReview } from "@/lib/reviews";

export async function POST(req: Request) {
  const formData = await req.formData();

  if (String(formData.get("website") || "").trim()) {
    return NextResponse.json(
      { error: "Spam protection triggered." },
      { status: 400 }
    );
  }

  try {
    const review = await createPublicReview({
      reviewerName: String(formData.get("reviewerName") || ""),
      reviewerLocation: String(formData.get("reviewerLocation") || ""),
      title: String(formData.get("title") || ""),
      body: String(formData.get("body") || ""),
      rating: String(formData.get("rating") || ""),
      stayLabel: String(formData.get("stayLabel") || ""),
      cabinId: String(formData.get("cabinId") || ""),
    });

    return NextResponse.json({ review });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Please check the review form." },
        { status: 400 }
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: "Unable to save the review right now." },
      { status: 500 }
    );
  }
}
