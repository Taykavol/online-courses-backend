-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentID" TEXT,
ADD COLUMN     "amount" DECIMAL(65,30),
ADD COLUMN     "currency" TEXT;
