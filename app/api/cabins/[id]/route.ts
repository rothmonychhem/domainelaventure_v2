import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { id } = await params;
  const formData = await req.formData();

  const name = String(formData.get("name") || "");
  const slug = String(formData.get("slug") || "");
  const description = String(formData.get("description") || "");
  const price = String(formData.get("price") || "");
  const guests = Number(formData.get("guests") || 0);
  const bedrooms = Number(formData.get("bedrooms") || 0);
  const bathrooms = Number(formData.get("bathrooms") || 0);
  const imagesRaw = String(formData.get("images") || "");

  const images = imagesRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  await prisma.cabin.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      price,
      guests,
      bedrooms,
      bathrooms,
    },
  });

  await prisma.cabinImage.deleteMany({
    where: { cabinId: id },
  });

  await prisma.cabinImage.createMany({
    data: images.map((url, index) => ({
      url,
      position: index,
      cabinId: id,
    })),
  });

  return NextResponse.redirect(new URL("/admin", req.url));
}