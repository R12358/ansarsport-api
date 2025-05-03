/*
  Warnings:

  - You are about to drop the column `fullName` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "fullName",
DROP COLUMN "imageUrl";
