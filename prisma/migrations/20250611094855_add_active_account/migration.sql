-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeAccountId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeAccountId_fkey" FOREIGN KEY ("activeAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
