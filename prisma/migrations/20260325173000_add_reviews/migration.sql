-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "reviewerLocation" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'direct',
    "stayLabel" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "cabinId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review"
ADD CONSTRAINT "Review_cabinId_fkey"
FOREIGN KEY ("cabinId") REFERENCES "Cabin"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
