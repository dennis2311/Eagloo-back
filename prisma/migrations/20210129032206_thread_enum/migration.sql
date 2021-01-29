/*
  Warnings:

  - You are about to drop the column `classId` on the `Mainthread` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Mainthread` table. All the data in the column will be lost.
  - Added the required column `college` to the `Mainthread` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Mainthread` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "College" AS ENUM ('Undefined', 'Liberal_Arts', 'Commerce_and_Economics', 'Business', 'Science', 'Engineering', 'Life_Science_and_Biotechnology', 'Theology', 'Social_Sciences', 'Law', 'Music', 'Human_Ecology', 'Educational_Science', 'University_College', 'Underwood_International_College', 'Global_Leadership_Division', 'Medicine', 'Dentistry', 'Nursing', 'Pharmacy');

-- DropForeignKey
ALTER TABLE "Mainthread" DROP CONSTRAINT "Mainthread_classId_fkey";

-- AlterTable
ALTER TABLE "Mainthread" DROP COLUMN "classId",
DROP COLUMN "title",
ADD COLUMN     "college" "College" NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL;
