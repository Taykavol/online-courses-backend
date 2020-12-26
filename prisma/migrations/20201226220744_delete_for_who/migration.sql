/*
  Warnings:

  - You are about to drop the column `forWho` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `whatStudentsGet` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "forWho",
DROP COLUMN "whatStudentsGet";
