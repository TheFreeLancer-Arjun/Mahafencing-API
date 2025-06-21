/*
  Warnings:

  - You are about to drop the column `otpForResetPassword` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `otpForVerification` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `TodoMedia` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `TodoMedia` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `publicUrl` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicUrl` to the `TodoMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Profile_publicId_key";

-- DropIndex
DROP INDEX "TodoMedia_publicId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "otpForResetPassword",
DROP COLUMN "otpForVerification",
DROP COLUMN "password";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "publicId",
DROP COLUMN "url",
ADD COLUMN     "publicUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "tags" DROP NOT NULL,
ALTER COLUMN "subTasks" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TodoMedia" DROP COLUMN "publicId",
DROP COLUMN "url",
ADD COLUMN     "publicUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "UserAddedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "otpForResetPassword" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "otpForVerification" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "password" TEXT NOT NULL;
