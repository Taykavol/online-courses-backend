/*
  Warnings:

  - Made the column `userId` on table `instructorProfile` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "instructorProfile" ADD COLUMN     "instructorRating" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "userId" SET NOT NULL;
