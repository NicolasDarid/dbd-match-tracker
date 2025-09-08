/*
  Warnings:

  - You are about to drop the `_killerMatches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_teammates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_killerMatches" DROP CONSTRAINT "_killerMatches_A_fkey";

-- DropForeignKey
ALTER TABLE "_killerMatches" DROP CONSTRAINT "_killerMatches_B_fkey";

-- DropForeignKey
ALTER TABLE "_teammates" DROP CONSTRAINT "_teammates_A_fkey";

-- DropForeignKey
ALTER TABLE "_teammates" DROP CONSTRAINT "_teammates_B_fkey";

-- DropTable
DROP TABLE "_killerMatches";

-- DropTable
DROP TABLE "_teammates";
