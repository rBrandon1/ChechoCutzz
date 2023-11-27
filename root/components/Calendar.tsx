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
    ?.filter(
      (appointment: any) =>
        appointment?.status === "available" &&
        !isPastDate(appointment?.dateTime) &&
        !isFullyBooked(appointment)
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
        fullyBooked: (date) => userRole === "admin" && isFullyBooked(date),
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
