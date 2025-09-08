/*
  Warnings:

  - You are about to drop the `_addOnTomatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_killerPerkTomatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_matchTomatchHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_matchTooffering` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_matchTosurvivor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_matchTosurvivorPerk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `addOn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `match` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `offering` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_addOnTomatch" DROP CONSTRAINT "_addOnTomatch_A_fkey";

-- DropForeignKey
ALTER TABLE "_addOnTomatch" DROP CONSTRAINT "_addOnTomatch_B_fkey";

-- DropForeignKey
ALTER TABLE "_killerPerkTomatch" DROP CONSTRAINT "_killerPerkTomatch_A_fkey";

-- DropForeignKey
ALTER TABLE "_killerPerkTomatch" DROP CONSTRAINT "_killerPerkTomatch_B_fkey";

-- DropForeignKey
ALTER TABLE "_matchTomatchHistory" DROP CONSTRAINT "_matchTomatchHistory_A_fkey";

-- DropForeignKey
ALTER TABLE "_matchTomatchHistory" DROP CONSTRAINT "_matchTomatchHistory_B_fkey";

-- DropForeignKey
ALTER TABLE "_matchTooffering" DROP CONSTRAINT "_matchTooffering_A_fkey";

-- DropForeignKey
ALTER TABLE "_matchTooffering" DROP CONSTRAINT "_matchTooffering_B_fkey";

-- DropForeignKey
ALTER TABLE "_matchTosurvivor" DROP CONSTRAINT "_matchTosurvivor_A_fkey";

-- DropForeignKey
ALTER TABLE "_matchTosurvivor" DROP CONSTRAINT "_matchTosurvivor_B_fkey";

-- DropForeignKey
ALTER TABLE "_matchTosurvivorPerk" DROP CONSTRAINT "_matchTosurvivorPerk_A_fkey";

-- DropForeignKey
ALTER TABLE "_matchTosurvivorPerk" DROP CONSTRAINT "_matchTosurvivorPerk_B_fkey";

-- DropForeignKey
ALTER TABLE "match" DROP CONSTRAINT "match_killerId_fkey";

-- DropForeignKey
ALTER TABLE "match" DROP CONSTRAINT "match_mapId_fkey";

-- DropTable
DROP TABLE "_addOnTomatch";

-- DropTable
DROP TABLE "_killerPerkTomatch";

-- DropTable
DROP TABLE "_matchTomatchHistory";

-- DropTable
DROP TABLE "_matchTooffering";

-- DropTable
DROP TABLE "_matchTosurvivor";

-- DropTable
DROP TABLE "_matchTosurvivorPerk";

-- DropTable
DROP TABLE "addOn";

-- DropTable
DROP TABLE "match";

-- DropTable
DROP TABLE "offering";

-- CreateTable
CREATE TABLE "killerAddOn" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "killerAddOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "killerOffering" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "killerOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survivorAddOn" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "survivorAddOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survivorOffering" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "survivorOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "killerMatch" (
    "id" TEXT NOT NULL,
    "killerId" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numberOfKills" INTEGER NOT NULL,
    "numberOfHooks" INTEGER NOT NULL,
    "numberOfGeneratorsRemaining" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "killerWin" BOOLEAN NOT NULL,

    CONSTRAINT "killerMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survivorMatch" (
    "id" TEXT NOT NULL,
    "survivorId" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "killerId" TEXT NOT NULL,
    "numberOfRescues" INTEGER NOT NULL,
    "numberOfGeneratorsDone" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "survivorWin" BOOLEAN NOT NULL,

    CONSTRAINT "survivorMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_killerAddOnTokillerMatch" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_killerAddOnTokillerMatch_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_survivorAddOnTosurvivorMatch" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_survivorAddOnTosurvivorMatch_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_killerMatchTokillerPerk" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_killerMatchTokillerPerk_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_killerMatchTokillerOffering" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_killerMatchTokillerOffering_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_killerMatches" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_killerMatches_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_matchHistoryKiller" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_matchHistoryKiller_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_survivorMatchTosurvivorPerk" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_survivorMatchTosurvivorPerk_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_survivorMatchTosurvivorOffering" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_survivorMatchTosurvivorOffering_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_matchHistorySurvivor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_matchHistorySurvivor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_killerAddOnTokillerMatch_B_index" ON "_killerAddOnTokillerMatch"("B");

-- CreateIndex
CREATE INDEX "_survivorAddOnTosurvivorMatch_B_index" ON "_survivorAddOnTosurvivorMatch"("B");

-- CreateIndex
CREATE INDEX "_killerMatchTokillerPerk_B_index" ON "_killerMatchTokillerPerk"("B");

-- CreateIndex
CREATE INDEX "_killerMatchTokillerOffering_B_index" ON "_killerMatchTokillerOffering"("B");

-- CreateIndex
CREATE INDEX "_killerMatches_B_index" ON "_killerMatches"("B");

-- CreateIndex
CREATE INDEX "_matchHistoryKiller_B_index" ON "_matchHistoryKiller"("B");

-- CreateIndex
CREATE INDEX "_survivorMatchTosurvivorPerk_B_index" ON "_survivorMatchTosurvivorPerk"("B");

-- CreateIndex
CREATE INDEX "_survivorMatchTosurvivorOffering_B_index" ON "_survivorMatchTosurvivorOffering"("B");

-- CreateIndex
CREATE INDEX "_matchHistorySurvivor_B_index" ON "_matchHistorySurvivor"("B");

-- AddForeignKey
ALTER TABLE "killerMatch" ADD CONSTRAINT "killerMatch_killerId_fkey" FOREIGN KEY ("killerId") REFERENCES "killer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "killerMatch" ADD CONSTRAINT "killerMatch_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survivorMatch" ADD CONSTRAINT "survivorMatch_survivorId_fkey" FOREIGN KEY ("survivorId") REFERENCES "survivor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survivorMatch" ADD CONSTRAINT "survivorMatch_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survivorMatch" ADD CONSTRAINT "survivorMatch_killerId_fkey" FOREIGN KEY ("killerId") REFERENCES "killer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_killerAddOnTokillerMatch" ADD CONSTRAINT "_killerAddOnTokillerMatch_A_fkey" FOREIGN KEY ("A") REFERENCES "killerAddOn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_killerAddOnTokillerMatch" ADD CONSTRAINT "_killerAddOnTokillerMatch_B_fkey" FOREIGN KEY ("B") REFERENCES "killerMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_survivorAddOnTosurvivorMatch" ADD CONSTRAINT "_survivorAddOnTosurvivorMatch_A_fkey" FOREIGN KEY ("A") REFERENCES "survivorAddOn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_survivorAddOnTosurvivorMatch" ADD CONSTRAINT "_survivorAddOnTosurvivorMatch_B_fkey" FOREIGN KEY ("B") REFERENCES "survivorMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_killerMatchTokillerPerk" ADD CONSTRAINT "_killerMatchTokillerPerk_A_fkey" FOREIGN KEY ("A") REFERENCES "killerMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_killerMatchTokillerPerk" ADD CONSTRAINT "_killerMatchTokillerPerk_B_fkey" FOREIGN KEY ("B") REFERENCES "killerPerk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_killerMatchTokillerOffering" ADD CONSTRAINT "_killerMatchTokillerOffering_A_fkey" FOREIGN KEY ("A") REFERENCES "killerMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_killerMatchTokillerOffering" ADD CONSTRAINT "_killerMatchTokillerOffering_B_fkey" FOREIGN KEY ("B") REFERENCES "killerOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_killerMatches" ADD CONSTRAINT "_killerMatches_A_fkey" FOREIGN KEY ("A") REFERENCES "killerMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_killerMatches" ADD CONSTRAINT "_killerMatches_B_fkey" FOREIGN KEY ("B") REFERENCES "survivor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_matchHistoryKiller" ADD CONSTRAINT "_matchHistoryKiller_A_fkey" FOREIGN KEY ("A") REFERENCES "killerMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_matchHistoryKiller" ADD CONSTRAINT "_matchHistoryKiller_B_fkey" FOREIGN KEY ("B") REFERENCES "matchHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_survivorMatchTosurvivorPerk" ADD CONSTRAINT "_survivorMatchTosurvivorPerk_A_fkey" FOREIGN KEY ("A") REFERENCES "survivorMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_survivorMatchTosurvivorPerk" ADD CONSTRAINT "_survivorMatchTosurvivorPerk_B_fkey" FOREIGN KEY ("B") REFERENCES "survivorPerk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_survivorMatchTosurvivorOffering" ADD CONSTRAINT "_survivorMatchTosurvivorOffering_A_fkey" FOREIGN KEY ("A") REFERENCES "survivorMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_survivorMatchTosurvivorOffering" ADD CONSTRAINT "_survivorMatchTosurvivorOffering_B_fkey" FOREIGN KEY ("B") REFERENCES "survivorOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_matchHistorySurvivor" ADD CONSTRAINT "_matchHistorySurvivor_A_fkey" FOREIGN KEY ("A") REFERENCES "matchHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_matchHistorySurvivor" ADD CONSTRAINT "_matchHistorySurvivor_B_fkey" FOREIGN KEY ("B") REFERENCES "survivorMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
