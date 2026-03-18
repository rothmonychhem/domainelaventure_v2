import { prisma } from "@/lib/prisma";

export async function getAllCabins() {
  return prisma.cabin.findMany({
    include: {
      images: {
        orderBy: { position: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCabinBySlug(slug: string) {
  return prisma.cabin.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { position: "asc" },
      },
    },
  });
}

export async function getCabinById(id: string) {
  return prisma.cabin.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { position: "asc" },
      },
    },
  });
}