-- CreateTable
CREATE TABLE "_teammates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_teammates_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_teammates_B_index" ON "_teammates"("B");

-- AddForeignKey
ALTER TABLE "_teammates" ADD CONSTRAINT "_teammates_A_fkey" FOREIGN KEY ("A") REFERENCES "survivor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_teammates" ADD CONSTRAINT "_teammates_B_fkey" FOREIGN KEY ("B") REFERENCES "survivorMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
