"use client";

import { Calendar } from "@/components/ui/calendar";

const CalendarComponent = ({
  appointments,
  selectedDate,
  onDateSelect,
  filterMode = "available",
}: any) => {
  const availableDates = appointments
    ?.filter((appointment: any) => {
      return filterMode === "available"
        ? appointment.status === "available"
        : true;
    })
    .map((appointment: any) => new Date(appointment.dateTime));

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
              d.toISOString().split("T")[0] === date.toISOString().split("T")[0]
          ),
      }}
      modifiersStyles={{
        available: { backgroundColor: "darkgray" },
      }}
    />
  );
};

export default CalendarComponent;
