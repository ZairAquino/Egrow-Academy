/*
  Warnings:

  - You are about to drop the column `verificationExpires` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "verificationExpires",
ADD COLUMN     "verificationCodeExpires" TIMESTAMP(3);
