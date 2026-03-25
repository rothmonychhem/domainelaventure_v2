import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { buildCabinSlug } from "@/lib/cabin-listing";

const mockCabinImages = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
];

function isDatabaseConnectionError(error: unknown) {
  return error instanceof Error && error.message.toLowerCase().includes("fetch failed");
}

export async function POST(req: Request) {
  const session = await getSession();

  if (!session || session.role !== "owner") {
    return NextResponse.redirect(new URL("/login", req.url), {
      status: 303,
    });
  }

  const timestamp = Date.now();
  const name = `Mock Forest Retreat ${timestamp.toString().slice(-4)}`;
  const address = "Laurentians, Quebec";
  const slug = buildCabinSlug({ name, address });

  try {
    await prisma.cabin.create({
      data: {
        name,
        slug,
        address,
        description:
          "A polished mock listing for testing the owner workflow, cabin pages, and reservation experience before real content is entered.",
        price: "325.00",
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        wifi: true,
        hotTub: true,
        lakeAccess: true,
        fireplace: true,
        bbq: true,
        airConditioning: true,
        fullKitchen: true,
        washerDryer: true,
        workspace: true,
        petFriendly: false,
        selfCheckIn: true,
        freeParking: true,
        featured: true,
        images: {
          create: mockCabinImages.map((url, index) => ({
            url,
            mediaType: "image",
            isHero: index === 0,
            position: index,
          })),
        },
      },
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return NextResponse.redirect(new URL("/admin", req.url), {
        status: 303,
      });
    }

    throw error;
  }

  return NextResponse.redirect(new URL("/admin", req.url), {
    status: 303,
  });
}
