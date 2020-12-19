-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "category" SET DEFAULT E'BASICS',
ALTER COLUMN "category" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET DEFAULT E'BUILDING',
ALTER COLUMN "status" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT E'PENDING',
ALTER COLUMN "status" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "instructorProfile" ALTER COLUMN "paymentMethod" DROP NOT NULL,
ALTER COLUMN "paymentMethod" SET DEFAULT E'NO',
ALTER COLUMN "paymentMethod" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "Category";

-- DropEnum
DROP TYPE "InvoiceStatus";

-- DropEnum
DROP TYPE "Level";

-- DropEnum
DROP TYPE "Payment";

-- DropEnum
DROP TYPE "Status";
