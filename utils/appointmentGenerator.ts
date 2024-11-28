import { prisma } from "@/lib/prisma";
import { DateTime } from "luxon";

async function getTimeRangeSettings() {
  const settings = await prisma.timeRangeSettings.findFirst();
  return (
    settings || {
      weekdayStart: 10,
      weekdayEnd: 20,
      weekendStart: 8,
      weekendEnd: 20,
    }
  );
}

export async function generateAppointments() {
  await prisma.appointment.deleteMany({
    where: { status: "available" },
  });

  const settings = await getTimeRangeSettings();
  const today = DateTime.now().setZone("America/Los_Angeles").startOf("day");
  const twoWeeksLater = today.plus({ weeks: 2 });

  for (let date = today; date <= twoWeeksLater; date = date.plus({ days: 1 })) {
    const isWeekend = date.weekday >= 6;
    const range = isWeekend
      ? { start: settings.weekendStart, end: settings.weekendEnd }
      : { start: settings.weekdayStart, end: settings.weekdayEnd };
    for (let hour = range.start; hour < range.end; hour++) {
      for (let minute of [0, 30]) {
        const appointmentTime = date.set({ hour, minute });

        if (appointmentTime < DateTime.now()) continue;

        await prisma.appointment.create({
          data: {
            firstName: "",
            lastName: "",
            clientEmail: "",
            dateTime: appointmentTime.toJSDate(),
            status: "available",
          },
        });
      }
    }
  }
}

export async function markConflictingAppointments(bookedAppoinmentId: number) {
  try {
    const bookedAppoinment = await prisma.appointment.findUnique({
      where: { id: bookedAppoinmentId },
    });

    if (!bookedAppoinment) return;

    const bookedDateTime = DateTime.fromJSDate(bookedAppoinment.dateTime);
    const bookMinutesAfter = bookedDateTime.plus({ minutes: 60 });

    await prisma.appointment.deleteMany({
      where: {
        AND: [
          { dateTime: bookMinutesAfter.toJSDate() },
          { status: "available" },
        ],
      },
    });
  } catch (error) {
    throw error;
  }
}
