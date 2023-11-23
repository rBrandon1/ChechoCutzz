/*
  Warnings:

  - You are about to drop the column `value` on the `Price` table. All the data in the column will be lost.
  - Added the required column `price` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Appointment` ADD COLUMN `priceId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Price` DROP COLUMN `value`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `price` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_priceId_fkey` FOREIGN KEY (`priceId`) REFERENCES `Price`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
