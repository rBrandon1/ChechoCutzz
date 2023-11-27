"use client";

import { Calendar } from "@/components/ui/calendar";

const CalendarComponent = ({
  appointments,
  selectedDate,
  onDateSelect,
  userRole = "user",
}: any) => {
  const today = new Date();
  const isToday = (date: Date) =>
    date?.toDateString() === today?.toDateString();
  const isPastDate = (date: number) => date < today.getTime();

  const hadAppointment = (date: Date) => {
    return appointments?.some((appointment: any) => {
      const appointmentDate = new Date(appointment?.dateTime);
      return (
        isPastDate(appointmentDate?.getTime()) &&
        appointmentDate?.toDateString() === date?.toDateString()
      );
    });
  };

  const availableDates = appointments
    ?.filter(
      (appointment: any) =>
        appointment?.status === "available" &&
        !isPastDate(appointment?.dateTime)
    )
    .map((appointment: any) => new Date(appointment?.dateTime));

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
              !isPastDate(date?.getTime()) &&
              !isToday(date)
          ),
        past: (date) =>
          userRole === "admin" &&
          hadAppointment(date) &&
          isPastDate(date?.getTime()) &&
          !isToday(date),
        today: isToday,
        selected: (date) =>
          date?.toDateString() === selectedDate?.toDateString(),
      }}
      modifiersStyles={{
        available: { backgroundColor: "darkgray" },
        past: {
          color: "hsl(var(--background))",
          backgroundColor: "hsl(var(--secondary))",
        },
        today: {
          backgroundColor: "slategray",
        },
        selected: {
          backgroundColor: "var(--primary-foreground))",
          fontWeight: "bold",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        },
      }}
    />
  );
};

export default CalendarComponent;
