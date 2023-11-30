-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_userId_fkey`;

-- AlterTable
ALTER TABLE `Appointment` MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
