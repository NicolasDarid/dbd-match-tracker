-- CreateTable
CREATE TABLE "killer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "killer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survivor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "survivor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "killerPerk" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "killerPerk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survivorPerk" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "survivorPerk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addOn" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "addOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offering" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "offering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "map" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match" (
    "id" TEXT NOT NULL,
    "killerId" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "numberOfKills" INTEGER NOT NULL,
    "numberOfHooks" INTEGER NOT NULL,
    "numberOfGeneratorsRemaining" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "killerWin" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matchHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "matchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_killerTomatchHistory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_killerTomatchHistory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_killerPerkTomatch" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_killerPerkTomatch_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_addOnTomatch" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_addOnTomatch_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_matchTosurvivor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_matchTosurvivor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_matchTosurvivorPerk" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_matchTosurvivorPerk_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_matchTooffering" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_matchTooffering_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_matchTomatchHistory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_matchTomatchHistory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_matchHistoryTosurvivor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_matchHistoryTosurvivor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_killerTomatchHistory_B_index" ON "_killerTomatchHistory"("B");

-- CreateIndex
CREATE INDEX "_killerPerkTomatch_B_index" ON "_killerPerkTomatch"("B");

-- CreateIndex
CREATE INDEX "_addOnTomatch_B_index" ON "_addOnTomatch"("B");

-- CreateIndex
CREATE INDEX "_matchTosurvivor_B_index" ON "_matchTosurvivor"("B");

-- CreateIndex
CREATE INDEX "_matchTosurvivorPerk_B_index" ON "_matchTosurvivorPerk"("B");

-- CreateIndex
CREATE INDEX "_matchTooffering_B_index" ON "_matchTooffering"("B");

-- CreateIndex
CREATE INDEX "_matchTomatchHistory_B_index" ON "_matchTomatchHistory"("B");

-- CreateIndex
CREATE INDEX "_matchHistoryTosurvivor_B_index" ON "_matchHistoryTosurvivor"("B");

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_killerId_fkey" FOREIGN KEY ("killerId") REFERENCES "killer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matchHistory" ADD CONSTRAINT "matchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_killerTomatchHistory" ADD CONSTRAINT "_killerTomatchHistory_A_fkey" FOREIGN KEY ("A") REFERENCES "killer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_killerTomatchHistory" ADD CONSTRAINT "_killerTomatchHistory_B_fkey" FOREIGN KEY ("B") REFERENCES "matchHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_killerPerkTomatch" ADD CONSTRAINT "_killerPerkTomatch_A_fkey" FOREIGN KEY ("A") REFERENCES "killerPerk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_killerPerkTomatch" ADD CONSTRAINT "_killerPerkTomatch_B_fkey" FOREIGN KEY ("B") REFERENCES "match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_addOnTomatch" ADD CONSTRAINT "_addOnTomatch_A_fkey" FOREIGN KEY ("A") REFERENCES "addOn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_addOnTomatch" ADD CONSTRAINT "_addOnTomatch_B_fkey" FOREIGN KEY ("B") REFERENCES "match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_matchTosurvivor" ADD CONSTRAINT "_matchTosurvivor_A_fkey" FOREIGN KEY ("A") REFERENCES "match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_matchTosurvivor" ADD CONSTRAINT "_matchTosurvivor_B_fkey" FOREIGN KEY ("B") REFERENCES "survivor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_matchTosurvivorPerk" ADD CONSTRAINT "_matchTosurvivorPerk_A_fkey" FOREIGN KEY ("A") REFERENCES "match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_matchTosurvivorPerk" ADD CONSTRAINT "_matchTosurvivorPerk_B_fkey" FOREIGN KEY ("B") REFERENCES "survivorPerk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_matchTooffering" ADD CONSTRAINT "_matchTooffering_A_fkey" FOREIGN KEY ("A") REFERENCES "match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_matchTooffering" ADD CONSTRAINT "_matchTooffering_B_fkey" FOREIGN KEY ("B") REFERENCES "offering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_matchTomatchHistory" ADD CONSTRAINT "_matchTomatchHistory_A_fkey" FOREIGN KEY ("A") REFERENCES "match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_matchTomatchHistory" ADD CONSTRAINT "_matchTomatchHistory_B_fkey" FOREIGN KEY ("B") REFERENCES "matchHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_matchHistoryTosurvivor" ADD CONSTRAINT "_matchHistoryTosurvivor_A_fkey" FOREIGN KEY ("A") REFERENCES "matchHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_matchHistoryTosurvivor" ADD CONSTRAINT "_matchHistoryTosurvivor_B_fkey" FOREIGN KEY ("B") REFERENCES "survivor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
