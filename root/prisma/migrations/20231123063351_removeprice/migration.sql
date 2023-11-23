/*
  Warnings:

  - You are about to drop the column `price` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `priceId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_priceId_fkey`;

-- AlterTable
ALTER TABLE `Appointment` DROP COLUMN `price`,
    DROP COLUMN `priceId`;

-- DropTable
DROP TABLE `Price`;
