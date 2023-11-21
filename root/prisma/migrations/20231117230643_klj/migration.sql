/*
  Warnings:

  - Made the column `userId` on table `Appointment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_userId_fkey`;

-- AlterTable
ALTER TABLE `Appointment` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
