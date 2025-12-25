/*
  Warnings:

  - You are about to drop the column `push_token` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_push_token_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "push_token",
ADD COLUMN     "push_tokens" TEXT[] DEFAULT ARRAY[]::TEXT[];
