/*
  Warnings:

  - Added the required column `publicId` to the `BannerImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `DistSportAwardee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `News` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `OfficeBearer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `OfficeBearerStatic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `OurGallery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `OurInspiration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `OurPartner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `ShivChhatrapatiAwardee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `ShowGallery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BannerImage" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DistSportAwardee" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OfficeBearer" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OfficeBearerStatic" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OurGallery" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OurInspiration" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OurPartner" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShivChhatrapatiAwardee" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShowGallery" ADD COLUMN     "publicId" TEXT NOT NULL;
