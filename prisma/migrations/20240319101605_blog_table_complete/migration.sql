/*
  Warnings:

  - The `published` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `image` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Draft', 'Published');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "image" TEXT[],
DROP COLUMN "published",
ADD COLUMN     "published" "Status" NOT NULL DEFAULT 'Draft';

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "image" TEXT NOT NULL;
