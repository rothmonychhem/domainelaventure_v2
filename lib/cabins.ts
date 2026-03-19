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

export async function getAllCabins(): Promise<CabinWithImages[]> {
  const cabins = await prisma.cabin.findMany({
    include: cabinInclude,
    orderBy: { createdAt: "desc" },
  });

  return cabins as CabinWithImages[];
}

export async function getCabinBySlug(
  slug: string
): Promise<CabinWithImages | null> {
  const cabin = await prisma.cabin.findUnique({
    where: { slug },
    include: cabinInclude,
  });

  return cabin as CabinWithImages | null;
}

export async function getCabinById(
  id: string
): Promise<CabinWithImages | null> {
  const cabin = await prisma.cabin.findUnique({
    where: { id },
    include: cabinInclude,
  });

  return cabin as CabinWithImages | null;
}
