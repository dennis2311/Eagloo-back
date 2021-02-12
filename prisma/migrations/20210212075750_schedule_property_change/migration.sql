/*
  Warnings:

  - The migration will remove the values [Undefined] on the enum `College`. If these variants are still used in the database, the migration will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "College_new" AS ENUM ('General', 'Liberal_Arts', 'Commerce_and_Economics', 'Business', 'Science', 'Engineering', 'Life_Science_and_Biotechnology', 'Theology', 'Social_Sciences', 'Law', 'Music', 'Human_Ecology', 'Educational_Science', 'University_College', 'Underwood_International_College', 'Global_Leadership_Division', 'Medicine', 'Dentistry', 'Nursing', 'Pharmacy');
ALTER TABLE "public"."Mainthread" ALTER COLUMN "college" TYPE "College_new" USING ("college"::text::"College_new");
ALTER TYPE "College" RENAME TO "College_old";
ALTER TYPE "College_new" RENAME TO "College";
DROP TYPE "College_old";
COMMIT;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "importance" INTEGER NOT NULL DEFAULT 1;
