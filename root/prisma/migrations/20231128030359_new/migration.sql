/*
  Warnings:

  - Made the column `clientEmail` on table `Appointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateTime` on table `Appointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstName` on table `Appointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `Appointment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Appointment` MODIFY `clientEmail` VARCHAR(191) NOT NULL,
    MODIFY `dateTime` DATETIME(3) NOT NULL,
    MODIFY `firstName` VARCHAR(191) NOT NULL,
    MODIFY `lastName` VARCHAR(191) NOT NULL;
