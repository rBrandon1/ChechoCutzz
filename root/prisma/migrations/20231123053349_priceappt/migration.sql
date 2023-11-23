/*
  Warnings:

  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Appointment` ADD COLUMN `price` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Price`;
