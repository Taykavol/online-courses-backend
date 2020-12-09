-- CreateEnum
CREATE TYPE "public"."Payment" AS ENUM ('NO', 'PAYPAL', 'BINANCE');

-- CreateEnum
CREATE TYPE "public"."InvoiceStatus" AS ENUM ('PAYOUT', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('OPENINGS', 'MIDDLEGAME', 'ENDGAME', 'GAMES', 'BASICS');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('BUILDING', 'VERIFYING', 'PUBLISH', 'UNPUBLISH');

-- CreateEnum
CREATE TYPE "public"."Level" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "public"."Title" AS ENUM ('GM', 'IM', 'FM', 'WGM', 'WIM');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'TEACHER', 'USER');

-- CreateTable
CREATE TABLE "User" (
"id" SERIAL,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "email" TEXT,
    "password" TEXT,
    "lichessId" TEXT,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "googleId" TEXT,
    "facebookId" TEXT,
    "VKId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instructorProfile" (
"id" SERIAL,
    "userId" INTEGER,
    "teacherName" TEXT,
    "title" "Title",
    "profit" DECIMAL(65,30) NOT NULL DEFAULT 0.5,
    "registedStudents" INTEGER NOT NULL DEFAULT 0,
    "avatar" TEXT,
    "aboutMe" TEXT,
    "publishedCourses" INTEGER NOT NULL DEFAULT 0,
    "paypalId" TEXT,
    "paymentMethod" "Payment" NOT NULL DEFAULT E'NO',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoughtCourse" (
"id" SERIAL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewId" INTEGER,
    "progressOfLessons" BOOLEAN[],
    "progressOfPuzzles" BOOLEAN[],

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
"id" SERIAL,
    "price" DECIMAL(65,30) NOT NULL,
    "courseId" INTEGER NOT NULL,
    "buyerId" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
"id" SERIAL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT E'PENDING',
    "total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
"id" SERIAL,
    "title" TEXT NOT NULL DEFAULT E'',
    "subtitle" TEXT NOT NULL DEFAULT E'',
    "authorId" INTEGER,
    "category" "Category" NOT NULL DEFAULT E'BASICS',
    "status" "Status" DEFAULT E'BUILDING',
    "lessons" INTEGER,
    "duration" INTEGER DEFAULT 0,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 20,
    "curriculum" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registedStudents" INTEGER NOT NULL DEFAULT 0,
    "reviewStats" INTEGER[],
    "videos" TEXT[],
    "pictureUri" TEXT,
    "promoVideo" TEXT,
    "totalPuzzles" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "level" INTEGER[],
    "sentences" TEXT[],
    "forWho" TEXT DEFAULT E'',
    "whatStudentsGet" TEXT DEFAULT E'',
    "description" JSONB,
    "searchRating" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
"id" SERIAL,
    "courseId" INTEGER NOT NULL,
    "review" INTEGER NOT NULL,
    "reviewMessage" TEXT,
    "authorName" TEXT,
    "reviewSubtitle" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.lichessId_unique" ON "User"("lichessId");

-- CreateIndex
CREATE UNIQUE INDEX "User.googleId_unique" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User.facebookId_unique" ON "User"("facebookId");

-- CreateIndex
CREATE UNIQUE INDEX "User.VKId_unique" ON "User"("VKId");

-- CreateIndex
CREATE UNIQUE INDEX "instructorProfile.userId_unique" ON "instructorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BoughtCourse.reviewId_unique" ON "BoughtCourse"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "BoughtCourse.userId_courseId_unique" ON "BoughtCourse"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice.month_year_profileId_unique" ON "Invoice"("month", "year", "profileId");

-- AddForeignKey
ALTER TABLE "instructorProfile" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoughtCourse" ADD FOREIGN KEY("courseId")REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoughtCourse" ADD FOREIGN KEY("reviewId")REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoughtCourse" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY("buyerId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY("courseId")REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY("sellerId")REFERENCES "instructorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD FOREIGN KEY("profileId")REFERENCES "instructorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD FOREIGN KEY("authorId")REFERENCES "instructorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD FOREIGN KEY("courseId")REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
