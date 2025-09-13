/*
  Warnings:

  - Added the required column `publicId` to the `AnnualReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnnualReport" ADD COLUMN     "publicId" TEXT NOT NULL;
