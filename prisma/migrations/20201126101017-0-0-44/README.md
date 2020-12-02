# Migration `20201126101017-0-0-44`

This migration has been generated by Taykavol at 11/26/2020, 1:10:17 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
DROP INDEX "public"."User.email_unique"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201126101001-0-0-42..20201126101017-0-0-44
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
@@ -13,9 +13,9 @@
 model User {
   id      Int      @default(autoincrement()) @id
   role Role @default(USER)
-  email   String? @unique
+  email   String? 
   password String? 
   lichessId String? @unique
   googleId String? @unique
   facebookId String? @unique
```

