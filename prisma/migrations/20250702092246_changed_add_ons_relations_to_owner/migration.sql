-- AlterTable
ALTER TABLE "killerAddOn" ADD COLUMN     "killerId" TEXT;

-- AlterTable
ALTER TABLE "survivorAddOn" ADD COLUMN     "survivorId" TEXT;

-- AddForeignKey
ALTER TABLE "killerAddOn" ADD CONSTRAINT "killerAddOn_killerId_fkey" FOREIGN KEY ("killerId") REFERENCES "killer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survivorAddOn" ADD CONSTRAINT "survivorAddOn_survivorId_fkey" FOREIGN KEY ("survivorId") REFERENCES "survivor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
