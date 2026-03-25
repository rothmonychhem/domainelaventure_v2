import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const cabinInclude = {
  images: {
    orderBy: { position: "asc" as const },
  },
};

export type CabinWithImages = Prisma.CabinGetPayload<{
  include: typeof cabinInclude;
}>;

function isDatabaseUnavailable(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("fetch failed") ||
    message.includes("econnrefused") ||
    message.includes("can't reach database server") ||
    message.includes("invalid datasource") ||
    message.includes("accelerate") ||
    message.includes("direct_database_url or database_url must be set") ||
    message.includes("column") && message.includes("does not exist") ||
    message.includes("relation") && message.includes("does not exist") ||
    message.includes("unknown field")
  );
}

export async function getAllCabins(): Promise<CabinWithImages[]> {
  try {
    const cabins = await prisma.cabin.findMany({
      include: cabinInclude,
      orderBy: { createdAt: "desc" },
    });

    return cabins as CabinWithImages[];
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return [];
    }

    throw error;
  }
}

export async function getCabinBySlug(
  slug: string
): Promise<CabinWithImages | null> {
  try {
    const cabin = await prisma.cabin.findUnique({
      where: { slug },
      include: cabinInclude,
    });

    return cabin as CabinWithImages | null;
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return null;
    }

    throw error;
  }
}

export async function getCabinById(
  id: string
): Promise<CabinWithImages | null> {
  try {
    const cabin = await prisma.cabin.findUnique({
      where: { id },
      include: cabinInclude,
    });

    return cabin as CabinWithImages | null;
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return null;
    }

    throw error;
  }
}
