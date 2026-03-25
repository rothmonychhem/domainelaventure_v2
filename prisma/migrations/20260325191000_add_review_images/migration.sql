-- AlterTable
ALTER TABLE "Review"
ADD COLUMN "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
