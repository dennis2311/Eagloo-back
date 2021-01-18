/*
  Warnings:

  - You are about to drop the column `progress` on the `Schedule` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Progress" AS ENUM ('SCRATCH', 'ONGOING', 'DONE');

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "progress",
ADD COLUMN     "state" INTEGER NOT NULL DEFAULT 0;
