/*
  Warnings:

  - You are about to drop the column `loginSecret` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "loginSecret",
ADD COLUMN     "verificationSecret" TEXT;
