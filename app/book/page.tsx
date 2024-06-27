"use client";

import AppointmentSkeleton from "@/components/AppointmentSkeleton";
import CalendarComponent from "@/components/Calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { formatDateAndTime } from "@/lib/formatDateTime";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookAppointment() {
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(
    DateTime.now().toLocal().startOf("day")
  );
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<string>("");

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/appointments", {
          cache: "no-store",
          method: "GET",
        });

        const { appointments } = await res.json();

        const convertedAppointments = appointments?.map((appointment: any) => ({
          ...appointment,
          dateTime: DateTime.fromISO(appointment.dateTime).toISO(),
        }));
        setAppointments(convertedAppointments);

        const userRes = await fetch("/api/users/current", {
          cache: "no-store",
          method: "GET",
        });

        if (!userRes.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userRes.json();
        setUser(userData.user);
      } catch (error: any) {
        toast({
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/price", {
          cache: "no-store",
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch price");
        }

        const { price } = await res.json();
        setCurrentPrice(price);
      } catch (error: any) {
        toast({
          description: "Failed to fetch price",
          variant: "destructive",
        });
      }
    };

    fetchAppointments();
    fetchPrice();
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(
      DateTime.fromJSDate(date).toLocal().startOf("day") as DateTime<true>
    );
  };

  const bookAppointment = async (appointment: any) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const updatedData = {
      id: appointment.id,
      dateTime: appointment.dateTime,
      clientEmail: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: "booked",
    };

    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to book appointment");
      }

      return responseData.appointment;
    } catch (error) {
      throw error;
    }
  };

  const handleBookAppointment = async (appointment: any) => {
    if (!user) {
      toast({
        description: "Please sign in to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    toast({
      description: "Booking appointment...",
    });

    try {
      await bookAppointment(appointment);
      toast({
        description: "Appointment booked!",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredAppointments = appointments
    ?.filter((appointment: any) => {
      const appointmentDateTime = DateTime.fromISO(
        appointment?.dateTime
      ).toLocal();
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

  const hasAvailableAppointments = filteredAppointments?.length > 0;

  return (
    <div>
      <h1 className="text-4xl italic mb-5">Book an Appointment</h1>
      <div className="mb-5">
        <h2 className="text-lg">
          Haircut - ${isLoading ? "..." : currentPrice}
        </h2>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="mb-4 md:mb-0 md:mr-4 rounded-md border shadow">
          <CalendarComponent
            appointments={appointments}
            selectedDate={selectedDate.toJSDate()}
            onDateSelect={handleDateSelect}
          />
        </div>

        {isLoading ? (
          <AppointmentSkeleton />
        ) : filteredAppointments?.length > 0 && hasAvailableAppointments ? (
          <div className="mx-auto w-full">
            <div className="m-0 px-0 py-1 overflow-scroll overscroll-contain h-80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">Time</TableHead>
                    <TableHead className="text-center">Book</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments?.map((appointment: any) => {
                    const { dateString, timeString } = formatDateAndTime(
                      appointment?.dateTime
                    );
                    return (
                      <TableRow
                        key={appointment?.id}
                        className="text-center tracking-wider text-[16px]"
                      >
                        <TableCell>{dateString}</TableCell>
                        <TableCell>{timeString}</TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="text-black">Book</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogTitle>
                                Confirm appointment
                              </AlertDialogTitle>
                              <AlertDialogDescription asChild>
                                <div className="inline">
                                  <div>
                                    Please confirm that you would like to book
                                    this appointment:
                                  </div>
                                  <div>
                                    Date:{" "}
                                    <span className="font-bold tracking-widest text-primary">
                                      {dateString}
                                    </span>
                                    , Time:{" "}
                                    <span className="font-bold tracking-widest text-primary">
                                      {timeString}
                                    </span>
                                  </div>
                                </div>
                              </AlertDialogDescription>
                              <AlertDialogCancel asChild>
                                <Button className="text-primary">Cancel</Button>
                              </AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <Button
                                  onClick={() => {
                                    handleBookAppointment(appointment);
                                  }}
                                  className="text-black"
                                >
                                  Confirm
                                </Button>
                              </AlertDialogAction>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center md:justify-start w-full text-center">
            <div>
              No available appointments on:
              <br />
              <span className="tracking-widest text-muted-foreground">
                {DateTime.fromJSDate(selectedDate.toJSDate())
                  .toLocal()
                  .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
