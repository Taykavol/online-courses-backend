-- CreateTable
CREATE TABLE "Const" (
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Const.name_unique" ON "Const"("name");
