/*
  Warnings:

  - You are about to drop the column `filePath` on the `Certificate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "filePath",
ADD COLUMN     "s3Key" TEXT NOT NULL DEFAULT 'https://onlydust-app-images.s3.eu-west-1.amazonaws.com/8ee3b7d84fe0672850e4c81890361b73.png';
