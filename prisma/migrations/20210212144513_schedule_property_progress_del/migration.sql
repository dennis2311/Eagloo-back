/*
  Warnings:

  - You are about to drop the column `progress` on the `Schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "progress";

-- DropEnum
DROP TYPE "Progress";
