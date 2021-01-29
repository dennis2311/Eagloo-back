/*
  Warnings:

  - You are about to drop the column `subject` on the `Feedback` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "subject",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT E'overview';
