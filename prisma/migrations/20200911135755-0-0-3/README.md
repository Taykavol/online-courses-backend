# Migration `20200911135755-0-0-3`

This migration has been generated by Taykavol at 9/11/2020, 4:57:56 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."BoughtCourse" DROP CONSTRAINT "BoughtCourse_reviewId_fkey"

ALTER TABLE "public"."BoughtCourse" DROP COLUMN "reviewId"

ALTER TABLE "public"."Review" ADD COLUMN "boughtCourseId" integer   NOT NULL 

CREATE UNIQUE INDEX "Review_boughtCourseId_unique" ON "public"."Review"("boughtCourseId")

ALTER TABLE "public"."Review" ADD FOREIGN KEY ("boughtCourseId")REFERENCES "public"."BoughtCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200911134946-0-0-3..20200911135755-0-0-3
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
@@ -81,10 +81,10 @@
 }
 model Review {
   id Int @default(autoincrement()) @id
-  // boughtCourse BoughtCourse @relation(fields: [boughtCourseId],references:[id])
-  // boughtCourseId Int
+  boughtCourse BoughtCourse @relation(fields: [boughtCourseId],references:[id])
+  boughtCourseId Int
   course Course @relation(fields: [courseId],references:[id])
   courseId Int
   review Int 
   reviewMessage String?
```

