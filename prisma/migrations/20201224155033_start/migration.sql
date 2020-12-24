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
    "googleId" TEXT,
    "facebookId" TEXT,
    "VKId" INTEGER,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instructorProfile" (
"id" SERIAL,
    "userId" INTEGER NOT NULL,
    "teacherName" TEXT DEFAULT E'',
    "title" "Title",
    "country" TEXT DEFAULT E'NO',
    "profit" DECIMAL(65,30) NOT NULL DEFAULT 0.5,
    "avatar" TEXT,
    "avatarBackground" TEXT,
    "aboutMe" TEXT,
    "publishedCourses" INTEGER NOT NULL DEFAULT 0,
    "registedStudents" INTEGER NOT NULL DEFAULT 0,
    "instructorRating" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "contactEmail" TEXT,
    "paypalId" TEXT,
    "paymentMethod" TEXT DEFAULT E'NO',
    "paymentInfo" JSONB,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoughtCourse" (
"id" SERIAL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "progressOfLessons" BOOLEAN[],
    "progressOfPuzzles" BOOLEAN[],
    "progress" INTEGER NOT NULL DEFAULT 0,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
"id" SERIAL,
    "price" DECIMAL(65,30) NOT NULL,
    "courseId" INTEGER NOT NULL,
    "buyerId" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "paymentID" TEXT,
    "amount" DECIMAL(65,30),
    "currency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
"id" SERIAL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    "status" TEXT DEFAULT E'PENDING',
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
    "description" JSONB,
    "forWho" TEXT DEFAULT E'',
    "whatStudentsGet" TEXT DEFAULT E'',
    "category" TEXT DEFAULT E'BASICS',
    "level" INTEGER[],
    "sentences" TEXT[],
    "status" TEXT DEFAULT E'BUILDING',
    "videos" TEXT[],
    "registedStudents" INTEGER NOT NULL DEFAULT 0,
    "lessons" INTEGER,
    "duration" INTEGER DEFAULT 0,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 20,
    "pictureUri" TEXT,
    "promoVideo" TEXT,
    "totalPuzzles" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "reviewStats" INTEGER[],
    "curriculum" JSONB,
    "searchRating" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
"id" SERIAL,
    "courseId" INTEGER NOT NULL,
    "review" INTEGER NOT NULL,
    "reviewMessage" TEXT,
    "reviewSubtitle" TEXT,
    "authorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Const" (
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL
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
CREATE UNIQUE INDEX "instructorProfile_userId_unique" ON "instructorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BoughtCourse.userId_courseId_unique" ON "BoughtCourse"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "BoughtCourse_reviewId_unique" ON "BoughtCourse"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice.month_year_profileId_unique" ON "Invoice"("month", "year", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Const.name_unique" ON "Const"("name");

-- AddForeignKey
ALTER TABLE "instructorProfile" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoughtCourse" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoughtCourse" ADD FOREIGN KEY("courseId")REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoughtCourse" ADD FOREIGN KEY("reviewId")REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY("courseId")REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY("buyerId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY("sellerId")REFERENCES "instructorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD FOREIGN KEY("profileId")REFERENCES "instructorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD FOREIGN KEY("authorId")REFERENCES "instructorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD FOREIGN KEY("courseId")REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
