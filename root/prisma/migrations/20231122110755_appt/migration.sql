/*
  Warnings:

  - You are about to drop the column `clientName` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Appointment` DROP COLUMN `clientName`,
    ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NULL;
