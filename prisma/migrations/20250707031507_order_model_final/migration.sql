-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '10 minutes';
