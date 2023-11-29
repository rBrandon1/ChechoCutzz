"use client";

import { Calendar } from "@/components/ui/calendar";
import moment from "moment-timezone";

const CalendarComponent = ({
  appointments,
  selectedDate,
  onDateSelect,
  userRole = "user",
}: any) => {
  const timezone = "America/Los_Angeles";
  const today = moment.tz(timezone).startOf("day");
  console.log(today.format());

  const isToday = (date: Date) => {
    return moment.tz(date, timezone).startOf("day").isSame(today, "day");
  };

  const isPastDate = (date: moment.Moment) => {
    return date.startOf("day").isBefore(today);
  };

  const hadAppointment = (date: Date) => {
    return appointments?.some((appointment: any) => {
      const appointmentDate = moment.tz(appointment?.dateTime, timezone);
      return (
        isPastDate(appointmentDate) &&
        appointmentDate?.isSame(moment.tz(date, timezone), "day")
      );
    });
  };
  const isFullyBooked = (date: Date) => {
    const dateAppointments = appointments?.filter((appointment: any) => {
      const appointmentDate = moment.tz(appointment, timezone);
      return appointmentDate?.isSame(moment.tz(date, timezone), "day");
    });
    return (
      dateAppointments?.length > 0 &&
      dateAppointments?.every(
        (appointment: any) => appointment?.status !== "available"
      )
    );
  };

  const availableDates = appointments
    ?.filter((appointment: any) => {
      const appointmentDate = moment.tz(appointment?.dateTime, timezone);
      return (
        appointment?.status === "available" && !isPastDate(appointmentDate)
      );
    })
    .map((appointment: any) => moment.tz(appointment, timezone).toDate());

  const handleDaySelect = (date: any) => {
    onDateSelect(moment.tz(date, timezone).toDate());
  };

  return (
    <Calendar
      selected={selectedDate}
      onSelect={handleDaySelect}
      mode="single"
      modifiers={{
        available: (date) =>
          availableDates?.some(
            (d: any) =>
              moment.tz(d, timezone).isSame(moment.tz(date, timezone), "day") &&
              !isPastDate(moment.tz(d, timezone)) &&
              !isPastDate(moment.tz(date, timezone)) &&
              !isToday(moment.tz(d, timezone).toDate()) &&
              !isToday(moment.tz(date, timezone).toDate())
          ),
        fullyBooked: (date) =>
          userRole === "admin" &&
          isFullyBooked(moment.tz(date, timezone).toDate()),
        past: (date) =>
          userRole === "admin" &&
          hadAppointment(moment.tz(date, timezone).toDate()) &&
          isPastDate(moment.tz(date, timezone)) &&
          !isToday(moment.tz(date, timezone).toDate()),
        today: isToday,
        selected: (date) =>
          moment
            .tz(date, timezone)
            .isSame(moment.tz(selectedDate, timezone), "day"),
      }}
      modifiersStyles={{
        fullyBooked: { backgroundColor: "hsl(144.9 80.4% 10%)" },
        available: { backgroundColor: "darkgray" },
        today: {
          backgroundColor: "slategray",
        },
        selected: {
          backgroundColor: "var(--primary-foreground))",
          fontWeight: "bold",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        },
        past: {
          color: "hsl(var(--background))",
          backgroundColor: "hsl(var(--secondary))",
        },
      }}
    />
  );
};

export default CalendarComponent;
