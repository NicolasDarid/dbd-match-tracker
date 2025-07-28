/*
  Warnings:

  - You are about to drop the column `survivorId` on the `survivorAddOn` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "survivorAddOn" DROP CONSTRAINT "survivorAddOn_survivorId_fkey";

-- AlterTable
ALTER TABLE "survivorAddOn" DROP COLUMN "survivorId";
