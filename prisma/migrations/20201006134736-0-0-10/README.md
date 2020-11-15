# Migration `20201006134736-0-0-10`

This migration has been generated by Taykavol at 10/6/2020, 4:47:36 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."instructorProfile" ADD COLUMN "profit" Decimal(65,30)   DEFAULT 0.5
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201006132457-0-0-9..20201006134736-0-0-10
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
@@ -29,8 +29,9 @@
   teacherName String?
   title Title?
   myCourses Course[]
   orders Order[]
+  profit Float? @default(0.5)
   // videos String[]
   // paypalId String?
 }
 model BoughtCourse {
```

