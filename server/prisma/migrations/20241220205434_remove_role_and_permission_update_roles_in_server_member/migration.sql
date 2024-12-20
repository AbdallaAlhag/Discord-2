/*
  Warnings:

  - You are about to drop the column `roleId` on the `ServerMember` table. All the data in the column will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ServerRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_serverId_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_userId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_serverId_fkey";

-- DropForeignKey
ALTER TABLE "ServerMember" DROP CONSTRAINT "ServerMember_roleId_fkey";

-- AlterTable
ALTER TABLE "ServerMember" DROP COLUMN "roleId",
ADD COLUMN     "role" "ServerRole" NOT NULL DEFAULT 'MEMBER';

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "Role";
