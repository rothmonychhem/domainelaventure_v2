import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getAmenitiesFromFormData } from "@/lib/amenities";
import { parseMediaState, saveUploadedMedia } from "@/lib/cabin-media";

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
      ...amenities,
    },
  });

  const existingMedia = mediaState
    .filter((item): item is { kind: "existing"; id: string; isHero: boolean } => item.kind === "existing")
    .map((item, index) => ({
      id: item.id,
      position: index,
      isHero: item.isHero,
    }));

  const keptIds = existingMedia.map((item) => item.id);

  await prisma.cabinImage.deleteMany({
    where: {
      cabinId: id,
      ...(keptIds.length > 0 ? { id: { notIn: keptIds } } : {}),
    },
  });

  await Promise.all(
    existingMedia.map((item) =>
      prisma.cabinImage.update({
        where: { id: item.id },
        data: {
          position: item.position,
          isHero: item.isHero,
        },
      })
    )
  );

  const newMedia = mediaState.flatMap((item, index) => {
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
      cabinId: id,
    };
  });

  if (newMedia.length > 0) {
    await prisma.cabinImage.createMany({
      data: newMedia,
    });
  }

  return NextResponse.redirect(new URL("/admin", req.url), {
    status: 303,
  });
}
