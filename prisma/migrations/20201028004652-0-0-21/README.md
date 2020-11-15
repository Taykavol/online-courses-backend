# Migration `20201028004652-0-0-21`

This migration has been generated by Taykavol at 10/28/2020, 3:46:52 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "public"."Payment" AS ENUM ('NO', 'PAYPAL', 'BINANCE')

ALTER TABLE "public"."instructorProfile" ADD COLUMN "paymentMethod" "Payment"  NOT NULL DEFAULT E'NO'
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201028001815-0-0-21..20201028004652-0-0-21
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -37,8 +37,9 @@
   publishedCourses Int @default(0)
   registedStudents Int @default(0)
   // videos String[]
   paypalId String?
+  paymentMethod Payment @default(NO)
 }
 model BoughtCourse {
   id Int @default(autoincrement()) @id
   user User @relation(fields: [userId],references:[id])
@@ -169,8 +170,14 @@
 //   fen String
 //   moves String[]
 //   helps String[]
 // }
+
+enum Payment {
+  NO
+  PAYPAL
+  BINANCE
+}
 enum InvoiceStatus {
   PAYOUT
   PENDING
 }
```

