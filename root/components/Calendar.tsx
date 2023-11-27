"use client";

import { Calendar } from "@/components/ui/calendar";

const CalendarComponent = ({
  appointments,
  selectedDate,
  onDateSelect,
  userRole = "user",
}: any) => {
  const now = new Date().getTime();
  const isPastDate = (date: number) => date < now;

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
                date?.toISOString().split("T")[0] && !isPastDate(d?.getTime())
          ),
        past: (date) =>
          userRole === "admin" &&
          hadAppointment(date) &&
          isPastDate(date?.getTime()),
      }}
      modifiersStyles={{
        available: { backgroundColor: "darkgray" },
        past: {
          color: "hsl(var(--background))",
          backgroundColor: "hsl(var(--secondary))",
        },
      }}
    />
  );
};

export default CalendarComponent;
