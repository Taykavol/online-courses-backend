/*
  Warnings:

  - You are about to alter the column `searchRating` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "searchRating" SET DEFAULT 0,
ALTER COLUMN "searchRating" SET DATA TYPE DECIMAL(65,30);
