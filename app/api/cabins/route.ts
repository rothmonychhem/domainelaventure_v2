import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getAmenitiesFromFormData } from "@/lib/amenities";
import { parseMediaState, saveUploadedMedia } from "@/lib/cabin-media";
import { buildCabinSlug } from "@/lib/cabin-listing";

function isDatabaseConnectionError(error: unknown) {
  return error instanceof Error && error.message.toLowerCase().includes("fetch failed");
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url), {
      status: 303,
    });
  }

  const formData = await req.formData();

  const name = String(formData.get("name") || "");
  const address = String(formData.get("address") || "");
  const slug = buildCabinSlug({ name, address });
  const description = String(formData.get("description") || "");
  const descriptionFr = String(formData.get("descriptionFr") || "").trim();
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

  try {
    await prisma.cabin.create({
      data: {
        name,
        slug,
        address,
        description,
        descriptionFr: descriptionFr || null,
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
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return NextResponse.redirect(new URL("/admin/cabins/new?error=db", req.url), {
        status: 303,
      });
    }

    throw error;
  }

  return NextResponse.redirect(new URL("/admin", req.url), {
    status: 303,
  });
}
