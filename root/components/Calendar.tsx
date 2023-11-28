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
  const today = moment.tz(new Date(), timezone).startOf("day");

  const isToday = (date: Date) => {
    const dateMoment = moment(date).startOf("day");
    return dateMoment.isSame(today, "day");
  };

  const isPastDate = (date: moment.Moment) => {
    return moment.tz(date, timezone).isBefore(today);
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
      const appointmentDate = new Date(appointment?.dateTime);
      return appointmentDate?.toDateString() === new Date(date).toDateString();
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
    .map((appointment: any) =>
      moment.tz(appointment?.dateTime, timezone).toDate()
    );

  const handleDaySelect = (date: any) => {
    onDateSelect(date);
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
              d?.toISOString().split("T")[0] ===
                date?.toISOString().split("T")[0] &&
              !isPastDate(d?.getTime()) &&
              !isPastDate(moment(date)) &&
              !isToday(date) &&
              !isToday(d)
          ),
        fullyBooked: (date) => userRole === "admin" && isFullyBooked(date),
        past: (date) =>
          userRole === "admin" &&
          hadAppointment(date) &&
          isPastDate(moment(date)) &&
          !isToday(date),
        today: isToday,
        selected: (date) => moment(date).isSame(selectedDate, "day"),
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
