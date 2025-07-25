-- AlterTable
ALTER TABLE "users" ADD COLUMN     "country" TEXT,
ADD COLUMN     "hasBeenPremium" BOOLEAN NOT NULL DEFAULT false;
