-- DropForeignKey
ALTER TABLE "Participants" DROP CONSTRAINT "Participants_orderRef_fkey";

-- AlterTable
ALTER TABLE "Participants" ALTER COLUMN "orderRef" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Participants" ADD CONSTRAINT "Participants_orderRef_fkey" FOREIGN KEY ("orderRef") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
