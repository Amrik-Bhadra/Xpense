/*
  Warnings:

  - You are about to drop the column `type` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Category_name_type_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "type";

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
