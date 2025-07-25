/*
  Warnings:

  - The values [DROPPED] on the enum `EnrollmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ANSWERED] on the enum `QuestionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `emailVerificationExpires` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerificationToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions_auth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EnrollmentStatus_new" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');
ALTER TABLE "enrollments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "enrollments" ALTER COLUMN "status" TYPE "EnrollmentStatus_new" USING ("status"::text::"EnrollmentStatus_new");
ALTER TYPE "EnrollmentStatus" RENAME TO "EnrollmentStatus_old";
ALTER TYPE "EnrollmentStatus_new" RENAME TO "EnrollmentStatus";
DROP TYPE "EnrollmentStatus_old";
ALTER TABLE "enrollments" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "QuestionStatus_new" AS ENUM ('OPEN', 'CLOSED', 'RESOLVED');
ALTER TABLE "questions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "questions" ALTER COLUMN "status" TYPE "QuestionStatus_new" USING ("status"::text::"QuestionStatus_new");
ALTER TYPE "QuestionStatus" RENAME TO "QuestionStatus_old";
ALTER TYPE "QuestionStatus_new" RENAME TO "QuestionStatus";
DROP TYPE "QuestionStatus_old";
ALTER TABLE "questions" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "sessions_auth" DROP CONSTRAINT "sessions_auth_userId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerificationExpires",
DROP COLUMN "emailVerificationToken",
ALTER COLUMN "emailVerified" SET DEFAULT true;

-- DropTable
DROP TABLE "accounts";

-- DropTable
DROP TABLE "sessions_auth";

-- DropTable
DROP TABLE "verification_tokens";
