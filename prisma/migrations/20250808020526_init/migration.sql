/*
  Warnings:

  - The primary key for the `UserVolunteer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserVolunteer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_volunteerId_fkey";

-- DropForeignKey
ALTER TABLE "CertificateDownloadLog" DROP CONSTRAINT "CertificateDownloadLog_certificateId_fkey";

-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_userId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UserVolunteer" DROP CONSTRAINT "UserVolunteer_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserVolunteer" DROP CONSTRAINT "UserVolunteer_volunteerId_fkey";

-- DropForeignKey
ALTER TABLE "Volunteer" DROP CONSTRAINT "Volunteer_projectId_fkey";

-- DropForeignKey
ALTER TABLE "escrows" DROP CONSTRAINT "escrows_user_id_fkey";

-- DropIndex
DROP INDEX "UserVolunteer_userId_volunteerId_key";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationTokenExpires" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserVolunteer" DROP CONSTRAINT "UserVolunteer_pkey",
DROP COLUMN "id",
ADD COLUMN     "hoursContributed" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD CONSTRAINT "UserVolunteer_pkey" PRIMARY KEY ("userId", "volunteerId");

-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN     "maxVolunteers" INTEGER NOT NULL DEFAULT 10;

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_receiverId_idx" ON "Message"("receiverId");

-- CreateIndex
CREATE INDEX "Message_volunteerId_idx" ON "Message"("volunteerId");
