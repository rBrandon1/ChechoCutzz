-- AlterTable
ALTER TABLE `Appointment` MODIFY `date` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'available';
