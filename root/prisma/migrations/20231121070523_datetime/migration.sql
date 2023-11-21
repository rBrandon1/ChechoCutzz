/*
  Warnings:

  - You are about to drop the column `date` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Appointment` DROP COLUMN `date`,
    DROP COLUMN `time`,
    ADD COLUMN `dateTime` DATETIME(3) NULL;
