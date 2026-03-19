import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getAmenitiesFromFormData } from "@/lib/amenities";
import { parseMediaState, saveUploadedMedia } from "@/lib/cabin-media";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url), {
      status: 303,
    });
  }

  const formData = await req.formData();

  const name = String(formData.get("name") || "");
  const slug = String(formData.get("slug") || "");
  const description = String(formData.get("description") || "");
  const price = String(formData.get("price") || "");
  const guests = Number(formData.get("guests") || 0);
  const bedrooms = Number(formData.get("bedrooms") || 0);
  const bathrooms = Number(formData.get("bathrooms") || 0);
  const amenities = getAmenitiesFromFormData(formData);
  const mediaState = parseMediaState(formData);
  const uploadedFiles = formData
    .getAll("mediaFiles")
    .filter((entry): entry is File => entry instanceof File);

  const uploadedMedia = await Promise.all(
    uploadedFiles.map((file) => saveUploadedMedia(file))
  );

  await prisma.cabin.create({
    data: {
      name,
      slug,
      description,
      price,
      guests,
      bedrooms,
      bathrooms,
      ...amenities,
      images: {
        create: mediaState.flatMap((item, index) => {
          if (item.kind !== "new") {
            return [];
          }

          const uploaded = uploadedMedia[item.fileIndex];
          if (!uploaded) {
            return [];
          }

          return {
            url: uploaded.url,
            mediaType: uploaded.mediaType,
            isHero: item.isHero && uploaded.mediaType === "image",
            position: index,
          };
        }),
      },
    },
  });

  return NextResponse.redirect(new URL("/admin", req.url), {
    status: 303,
  });
}
