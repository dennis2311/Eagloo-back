-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authenticated" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" SET DEFAULT E'eagloo';
