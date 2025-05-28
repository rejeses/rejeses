/*
  Warnings:

  - You are about to drop the `Participants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `participants` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participants" DROP CONSTRAINT "Participants_orderRef_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "participants" JSONB NOT NULL;

-- DropTable
DROP TABLE "Participants";
