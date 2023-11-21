/*
  Warnings:

  - You are about to drop the column `cientEmail` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Appointment` DROP COLUMN `cientEmail`,
    ADD COLUMN `clientEmail` VARCHAR(191) NULL;
