import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const exists = await prisma.cabin.findFirst();
  if (exists) return;

  await prisma.cabin.create({
    data: {
      name: "Forest Haven",
      slug: "forest-haven",
      description: "A warm cabin tucked into the woods with peaceful views and cozy comfort.",
      price: "$199/night",
      guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      wifi: true,
      hotTub: true,
      lakeAccess: true,
      fireplace: true,
      bbq: true,
      airConditioning: false,
      fullKitchen: true,
      washerDryer: true,
      workspace: true,
      petFriendly: true,
      selfCheckIn: true,
      freeParking: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
            position: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
            position: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
            position: 2,
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
