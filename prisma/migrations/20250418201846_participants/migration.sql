/*
  Warnings:

  - Added the required column `participantsId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "participantsId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Participants" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "otherName" TEXT,
    "orderRef" INTEGER NOT NULL,

    CONSTRAINT "Participants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Participants" ADD CONSTRAINT "Participants_orderRef_fkey" FOREIGN KEY ("orderRef") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
