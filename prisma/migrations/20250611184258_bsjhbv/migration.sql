/*
  Warnings:

  - The `priority` column on the `Todo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `list` column on the `Todo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `visibility` column on the `Todo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "priority",
ADD COLUMN     "priority" TEXT DEFAULT 'Low',
DROP COLUMN "list",
ADD COLUMN     "list" TEXT DEFAULT 'Personal',
DROP COLUMN "visibility",
ADD COLUMN     "visibility" TEXT DEFAULT 'Private';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isMailVerified" DROP NOT NULL,
ALTER COLUMN "provider" DROP NOT NULL,
ALTER COLUMN "otpForResetPassword" DROP NOT NULL,
ALTER COLUMN "otpForVerification" DROP NOT NULL;

-- DropEnum
DROP TYPE "ListType";

-- DropEnum
DROP TYPE "PriorityType";

-- DropEnum
DROP TYPE "VisibilityType";
