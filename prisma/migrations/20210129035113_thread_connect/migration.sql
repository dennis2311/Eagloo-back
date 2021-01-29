/*
  Warnings:

  - You are about to drop the column `index` on the `Subthread` table. All the data in the column will be lost.
  - Added the required column `mainthreadId` to the `Subthread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subthread" DROP COLUMN "index",
ADD COLUMN     "mainthreadId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Subthread" ADD FOREIGN KEY("mainthreadId")REFERENCES "Mainthread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
