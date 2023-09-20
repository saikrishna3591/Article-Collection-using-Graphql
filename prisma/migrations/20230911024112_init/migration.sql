-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('AUTHOR', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email_Id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Roles" NOT NULL DEFAULT 'AUTHOR',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Articles" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "author_Id" INTEGER NOT NULL,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_Id_key" ON "User"("email_Id");

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_author_Id_fkey" FOREIGN KEY ("author_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
