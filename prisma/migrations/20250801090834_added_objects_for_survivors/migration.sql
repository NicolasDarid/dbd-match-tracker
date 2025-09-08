/*
  Warnings:

  - Added the required column `objectId` to the `survivorAddOn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectId` to the `survivorMatch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "survivorAddOn" ADD COLUMN     "objectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "survivorMatch" ADD COLUMN     "objectId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "survivorObject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "survivorObject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "survivorAddOn" ADD CONSTRAINT "survivorAddOn_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "survivorObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survivorMatch" ADD CONSTRAINT "survivorMatch_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "survivorObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
