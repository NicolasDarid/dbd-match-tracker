/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `killer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `killerAddOn` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `killerOffering` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `killerPerk` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `map` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `survivor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `survivorAddOn` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `survivorObject` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `survivorOffering` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `survivorPerk` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "killer_name_key" ON "killer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "killerAddOn_name_key" ON "killerAddOn"("name");

-- CreateIndex
CREATE UNIQUE INDEX "killerOffering_name_key" ON "killerOffering"("name");

-- CreateIndex
CREATE UNIQUE INDEX "killerPerk_name_key" ON "killerPerk"("name");

-- CreateIndex
CREATE UNIQUE INDEX "map_name_key" ON "map"("name");

-- CreateIndex
CREATE UNIQUE INDEX "survivor_name_key" ON "survivor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "survivorAddOn_name_key" ON "survivorAddOn"("name");

-- CreateIndex
CREATE UNIQUE INDEX "survivorObject_name_key" ON "survivorObject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "survivorOffering_name_key" ON "survivorOffering"("name");

-- CreateIndex
CREATE UNIQUE INDEX "survivorPerk_name_key" ON "survivorPerk"("name");
