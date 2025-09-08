-- DropForeignKey
ALTER TABLE "survivorMatch" DROP CONSTRAINT "survivorMatch_objectId_fkey";

-- AlterTable
ALTER TABLE "survivorMatch" ALTER COLUMN "objectId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "survivorMatch" ADD CONSTRAINT "survivorMatch_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "survivorObject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
