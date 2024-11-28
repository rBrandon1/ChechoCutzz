"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateTime } from "luxon";

interface TimeSlotsProps {
  appointments: any[];
  selectedDate: DateTime;
  onSelectAppointment: (appointment: any) => void;
}

export default function TimeSlots({
  appointments,
  selectedDate,
  onSelectAppointment,
}: TimeSlotsProps) {
  const availableAppointments = appointments
    ?.filter((appointment: any) => {
      const appointmentDateTime = DateTime.fromISO(appointment?.dateTime).toLocal();
      return (
        appointmentDateTime >= DateTime.now().toLocal() &&
        appointment?.status === "available" &&
        appointmentDateTime?.hasSame(selectedDate, "day")
      );
    })
    .sort((a: any, b: any) => {
      return (
        DateTime.fromISO(a.dateTime).toLocal().toMillis() -
        DateTime.fromISO(b.dateTime).toLocal().toMillis()
      );
    });

  if (availableAppointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-center text-muted-foreground">
        <div>
          No available appointments on
          <br />
          <span className="font-medium text-foreground">
            {selectedDate.toLocaleString(DateTime.DATE_FULL)}
          </span>
        </div>
      </div>
    );
  }

  // Group appointments by morning/afternoon/evening
  const groupedAppointments = availableAppointments.reduce(
    (acc: any, appointment: any) => {
      const time = DateTime.fromISO(appointment.dateTime).toLocal();
      const hour = time.hour;
      let period = "morning"; // 6-11
      if (hour >= 12 && hour < 17) period = "afternoon"; // 12-4
      if (hour >= 17) period = "evening"; // 5 onwards

      if (!acc[period]) acc[period] = [];
      acc[period].push(appointment);
      return acc;
    },
    {}
  );

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border">
      <div className="p-4">
        {Object.entries(groupedAppointments).map(([period, slots]: [string, any]) => (
          <div key={period} className="mb-6 last:mb-0">
            <h3 className="mb-3 text-sm font-medium capitalize">
              {period}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((appointment: any) => {
                const time = DateTime.fromISO(appointment.dateTime).toLocal();
                return (
                  <Button
                    key={appointment.id}
                    variant="outline"
                    className="w-full hover:bg-primary hover:text-primary-foreground"
                    onClick={() => onSelectAppointment(appointment)}
                  >
                    {time.toFormat("hh:mm a")}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
