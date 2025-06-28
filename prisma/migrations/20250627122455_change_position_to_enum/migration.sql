/*
  Warnings:

  - You are about to drop the column `positionId` on the `members` table. All the data in the column will be lost.
  - You are about to drop the `positions` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Position" AS ENUM ('GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD', 'WINGER', 'STRIKER', 'SWEEPER', 'ATTACKING_MIDFIELDER');

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_positionId_fkey";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "positionId",
ADD COLUMN     "position" "Position";

-- DropTable
DROP TABLE "positions";
