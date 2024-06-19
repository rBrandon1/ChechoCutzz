"use client";

import { Calendar } from "@/components/ui/calendar";
import { DateTime } from "luxon";

const CalendarComponent = ({
  appointments,
  selectedDate,
  onDateSelect,
  userRole = "user",
}: any) => {
  const timezone = "America/Los_Angeles";
  const today = DateTime.now().toLocal().startOf("day");

  const isToday = (date: Date) => {
    return today.hasSame(DateTime.fromJSDate(date).toLocal(), "day");
  };

  const isPastDate = (date: DateTime) => {
    return date < today;
  };

  const hadAppointment = (date: DateTime) => {
    return appointments?.some((appointment: any) => {
      const appointmentDate = DateTime.fromISO(appointment?.dateTime)
        .toLocal()
        .startOf("day");
      return (
        isPastDate(appointmentDate) && appointmentDate?.hasSame(date, "day")
      );
    });
  };

  const isFullyBooked = (date: DateTime) => {
    const dateAppointments = appointments?.filter((appointment: any) => {
      const appointmentDate = DateTime.fromISO(appointment?.dateTime).setZone(
        timezone
      );
      return appointmentDate?.hasSame(date, "day");
    });
    return (
      dateAppointments?.length > 0 &&
      dateAppointments.every(
        (appointment: any) => appointment?.status !== "available"
      )
    );
  };

  const availableDates = appointments
    ?.filter((appointment: any) => {
      const appointmentDate = DateTime.fromJSDate(
        appointment?.dateTime
      ).toLocal();
      return (
        appointment?.status === "available" && !isPastDate(appointmentDate)
      );
    })
    .map((appointment: any) =>
      DateTime.fromISO(appointment?.dateTime).toLocal()
    );

  const handleDaySelect = (date: any) => {
    const selectedDateInLocal = DateTime.fromJSDate(date)
      .toLocal()
      .startOf("day")
      .toJSDate();
    onDateSelect(selectedDateInLocal);
  };

  return (
    <Calendar
      selected={selectedDate}
      onSelect={handleDaySelect}
      mode="single"
      modifiers={{
        available: (date) =>
          availableDates?.some((d: any) =>
            d?.hasSame(DateTime.fromJSDate(date).toLocal(), "day")
          ),
        fullyBooked: (date) =>
          userRole === "admin" &&
          isFullyBooked(DateTime.fromJSDate(date).toLocal()),
        past: (date) =>
          userRole === "admin" &&
          hadAppointment(DateTime.fromJSDate(date).toLocal()) &&
          isPastDate(DateTime.fromJSDate(date).toLocal()),
        today: (date) => isToday(date),
        selected: (date) =>
          DateTime.fromJSDate(date)
            .toLocal()
            .hasSame(DateTime.fromJSDate(selectedDate).toLocal(), "day"),
      }}
      modifiersStyles={{
        past: {
          color: "hsl(var(--background))",
          backgroundColor: "hsl(var(--secondary))",
        },
        available: { backgroundColor: "darkgray" },
        today: {
          backgroundColor: "slategray",
        },
        fullyBooked: { backgroundColor: "hsl(144.9 80.4% 10%)" },
        selected: {
          fontWeight: "bold",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        },
      }}
    />
  );
};

export default CalendarComponent;
