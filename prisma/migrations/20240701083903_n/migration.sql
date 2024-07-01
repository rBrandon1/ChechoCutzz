/*
  Warnings:

  - You are about to drop the column `weekDayEnd` on the `TimeRangeSettings` table. All the data in the column will be lost.
  - You are about to drop the column `weekDayStart` on the `TimeRangeSettings` table. All the data in the column will be lost.
  - You are about to drop the column `weekEndEnd` on the `TimeRangeSettings` table. All the data in the column will be lost.
  - You are about to drop the column `weekEndStart` on the `TimeRangeSettings` table. All the data in the column will be lost.
  - Added the required column `weekdayEnd` to the `TimeRangeSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekdayStart` to the `TimeRangeSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekendEnd` to the `TimeRangeSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekendStart` to the `TimeRangeSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeRangeSettings" DROP COLUMN "weekDayEnd",
DROP COLUMN "weekDayStart",
DROP COLUMN "weekEndEnd",
DROP COLUMN "weekEndStart",
ADD COLUMN     "weekdayEnd" INTEGER NOT NULL,
ADD COLUMN     "weekdayStart" INTEGER NOT NULL,
ADD COLUMN     "weekendEnd" INTEGER NOT NULL,
ADD COLUMN     "weekendStart" INTEGER NOT NULL;
