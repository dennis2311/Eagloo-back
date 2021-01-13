/*
  Warnings:

  - You are about to drop the `Work` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Schedule_userId_unique";

-- DropForeignKey
ALTER TABLE "Work" DROP CONSTRAINT "Work_scheduleId_fkey";

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Work";
