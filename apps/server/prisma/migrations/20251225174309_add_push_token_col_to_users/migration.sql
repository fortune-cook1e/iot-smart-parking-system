/*
  Warnings:

  - A unique constraint covering the columns `[push_token]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "push_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_push_token_key" ON "users"("push_token");
