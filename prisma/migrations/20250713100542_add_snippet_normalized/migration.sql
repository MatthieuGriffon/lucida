/*
  Warnings:

  - You are about to drop the column `snippet` on the `BookProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookProgress" DROP COLUMN "snippet",
ADD COLUMN     "snippetNormalized" TEXT,
ADD COLUMN     "snippetRaw" TEXT;
