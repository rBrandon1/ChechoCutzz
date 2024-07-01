-- CreateTable
CREATE TABLE "TimeRangeSettings" (
    "id" SERIAL NOT NULL,
    "weekDayStart" INTEGER NOT NULL,
    "weekDayEnd" INTEGER NOT NULL,
    "weekEndStart" INTEGER NOT NULL,
    "weekEndEnd" INTEGER NOT NULL,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeRangeSettings_pkey" PRIMARY KEY ("id")
);
