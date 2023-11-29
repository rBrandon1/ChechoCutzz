"use client";

import { fetcher } from "@/lib/fetcher";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { formatDateAndTime } from "@/lib/formatDateTime";
import { useToast } from "@/components/ui/use-toast";
import useSWR from "swr";
import AppointmentSkeleton from "@/components/AppointmentSkeleton";
import CalendarComponent from "@/components/Calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment-timezone";

export default function BookAppointment() {
  const { user, isLoading, isAuthenticated } = useKindeBrowserClient();
  const { data, mutate } = useSWR("/api/appointments", fetcher);
  const { toast } = useToast();
  const router = useRouter();

  const currentPrice = "30";
  const timezone = "America/Los_Angeles";

  const bookAppointment = async (appointment: any) => {
    const updatedData = {
      id: appointment?.id,
      userId: user?.id,
      firstName: user?.given_name,
      lastName: user?.family_name,
      dateTime: appointment?.dateTime,
      clientEmail: user?.email,
      status: "booked",
    };

    const res = await fetch("/api/appointments", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      throw new Error("Something went wrong!");
    }

    await mutate((currentData: any) => {
      return {
        ...currentData,
        appointments: currentData?.appointments?.map((app: any) =>
          app?.id === appointment?.id ? { ...app, ...updatedData } : app
        ),
      };
    }, false);
  };

  const handleBookAppointment = async (appointment: any) => {
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

  const [selectedDate, setSelectedDate] = useState(
    moment.tz(new Date(), timezone).toDate()
  );
  const handleDateSelect = (date: any) => {
    setSelectedDate(moment.tz(date, timezone).toDate());
  };

  const filteredAppointments = data?.appointments
    ?.filter((appointment: any) => {
      const appointmentDateTime = moment
        .tz(appointment, timezone)
        .toDate()
        .getTime();
      const now = moment.tz(new Date(), timezone).toDate().getTime();

      return (
        appointmentDateTime >= now &&
        appointment?.status === "available" &&
        moment.tz(appointment?.dateTime, timezone).isSame(selectedDate, "day")
      );
    })
    .sort((a: any, b: any) => {
      const timeA = moment.tz(a.dateTime, timezone).toDate().getTime();
      const timeB = moment.tz(b.dateTime, timezone).toDate().getTime();
      return timeA - timeB;
    });

  const hasAvailableAppointments = data?.appointments?.some(
    (appointment: any) => appointment?.status === "available"
  );

  return (
    <div>
      <h1 className="text-4xl italic font-bold mb-5">Book an Appointment</h1>
      <div className="mb-5">
        <h2 className="text-lg">
          Haircut Price - ${isLoading ? "..." : currentPrice}
        </h2>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="mb-4 md:mb-0 md:mr-4 rounded-md border shadow">
          <CalendarComponent
            appointments={data?.appointments}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>
        <div className="mx-4 flex-grow">
          {isLoading ? (
            <AppointmentSkeleton />
          ) : filteredAppointments?.length > 0 && hasAvailableAppointments ? (
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
                            <Button>Book</Button>
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
                                  if (isAuthenticated) {
                                    handleBookAppointment(appointment);
                                  } else {
                                    toast({
                                      description:
                                        "You must be signed in to book an appointment!",
                                      variant: "destructive",
                                    });
                                  }
                                }}
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
          ) : (
            <div className="flex items-center justify-center md:justify-start h-full text-center">
              <div>
                No available appointments on:
                <br />
                <span className="tracking-widest text-muted-foreground">
                  {moment.tz(selectedDate, timezone).format("LL")}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
