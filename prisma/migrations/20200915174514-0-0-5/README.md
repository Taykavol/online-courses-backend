# Migration `20200915174514-0-0-5`

This migration has been generated by Taykavol at 9/15/2020, 8:45:14 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Course" DROP COLUMN "averageRating"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200913185538-0-0-5..20200915174514-0-0-5
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
@@ -71,9 +71,9 @@
 duration Int?
 price Float @default(20)
 orders Order[]
 // picture String?
-averageRating Float @default(0)
+// averageRating Float @default(0)
 reviewStats Int[]
 // numberReviews Int @default(0)
 curriculum String?
 reviews Review[]
```

