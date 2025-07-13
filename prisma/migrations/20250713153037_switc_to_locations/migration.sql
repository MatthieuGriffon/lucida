/*
  Warnings:

  - You are about to drop the column `snippetNormalized` on the `BookProgress` table. All the data in the column will be lost.
  - You are about to drop the column `snippetRaw` on the `BookProgress` table. All the data in the column will be lost.
  - Added the required column `loc` to the `BookProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookProgress" DROP COLUMN "snippetNormalized",
DROP COLUMN "snippetRaw",
ADD COLUMN     "loc" INTEGER NOT NULL;
