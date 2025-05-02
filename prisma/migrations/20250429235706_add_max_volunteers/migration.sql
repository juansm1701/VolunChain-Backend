/*
  Warnings:

  - The primary key for the `UserVolunteer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,volunteerId]` on the table `UserVolunteer` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `UserVolunteer` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "UserVolunteer" DROP CONSTRAINT "UserVolunteer_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "UserVolunteer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Volunteer" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET DATA TYPE TEXT,
ALTER COLUMN "requirements" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "UserVolunteer_userId_idx" ON "UserVolunteer"("userId");

-- CreateIndex
CREATE INDEX "UserVolunteer_volunteerId_idx" ON "UserVolunteer"("volunteerId");

-- CreateIndex
CREATE UNIQUE INDEX "UserVolunteer_userId_volunteerId_key" ON "UserVolunteer"("userId", "volunteerId");
