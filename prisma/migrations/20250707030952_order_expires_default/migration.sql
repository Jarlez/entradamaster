/*
  Warnings:

  - You are about to drop the column `price` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderItemId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Made the column `expiresAt` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "price",
ALTER COLUMN "slug" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "expiresAt" SET NOT NULL,
ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '10 minutes';

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_orderItemId_key" ON "Ticket"("orderItemId");

-- CreateIndex
CREATE INDEX "TicketCategory_eventId_idx" ON "TicketCategory"("eventId");
