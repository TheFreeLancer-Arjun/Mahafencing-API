/*
  Warnings:

  - You are about to drop the column `UserAddedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otpForResetPassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otpForVerification` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Avatar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PriorityType" AS ENUM ('High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "ListType" AS ENUM ('Personal', 'Work');

-- CreateEnum
CREATE TYPE "VisibilityType" AS ENUM ('Public', 'Private');

-- DropForeignKey
ALTER TABLE "Avatar" DROP CONSTRAINT "Avatar_userId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_userId_fkey";

-- DropForeignKey
ALTER TABLE "ContentImage" DROP CONSTRAINT "ContentImage_contentId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "UserAddedAt",
DROP COLUMN "otpForResetPassword",
DROP COLUMN "otpForVerification",
DROP COLUMN "password",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Avatar";

-- DropTable
DROP TABLE "Content";

-- DropTable
DROP TABLE "ContentImage";

-- DropEnum
DROP TYPE "ContentType";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "otpForVerification" TEXT NOT NULL DEFAULT '',
    "otpForResetPassword" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "links" TEXT,
    "priority" "PriorityType" DEFAULT 'Low',
    "list" "ListType" DEFAULT 'Personal',
    "visibility" "VisibilityType" DEFAULT 'Private',
    "date" TEXT,
    "time" TEXT,
    "tags" JSONB NOT NULL,
    "subTasks" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TodoMedia" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "todoId" TEXT NOT NULL,

    CONSTRAINT "TodoMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Todo_accountId_idx" ON "Todo"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_publicId_key" ON "Profile"("publicId");

-- CreateIndex
CREATE INDEX "Profile_accountId_idx" ON "Profile"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "TodoMedia_publicId_key" ON "TodoMedia"("publicId");

-- CreateIndex
CREATE INDEX "TodoMedia_todoId_idx" ON "TodoMedia"("todoId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoMedia" ADD CONSTRAINT "TodoMedia_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
