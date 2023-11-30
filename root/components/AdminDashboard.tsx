"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { formatDateAndTime } from "@/lib/formatDateTime";
import CalendarComponent from "@/components/Calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
import { useToast } from "@/components/ui/use-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import AppointmentSkeleton from "./AppointmentSkeleton";
import { DateTime } from "luxon";

export default function AdminDashboard() {
  const { isLoading } = useKindeBrowserClient();
  const { data, mutate } = useSWR("/api/appointments", fetcher);
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState(
    DateTime.now().toLocal().startOf("day")
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(DateTime.fromJSDate(date).toLocal().startOf("day"));
  };

  const filteredAppointments = data?.convertedAppointments
    ?.filter((appointment: any) => {
      const appointmentDateTime = DateTime.fromISO(
        appointment?.dateTime
      ).toLocal();
      return (
        appointmentDateTime >= DateTime.now().toLocal() &&
        appointmentDateTime?.hasSame(selectedDate, "day")
      );
    })
    .sort((a: any, b: any) => {
      return (
        DateTime.fromISO(a.dateTime).toLocal().toMillis() -
        DateTime.fromISO(b.dateTime).toLocal().toMillis()
      );
    });

  const appointmentsByDate = data?.convertedAppointments?.filter(
    (appointment: any) => {
      return DateTime.fromISO(appointment?.dateTime)
        .toLocal()
        .hasSame(selectedDate, "day");
    }
  );

  const handleDeleteAppointment = async (appointment: any) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: appointment?.id,
          dateTime: appointment?.dateTime,
          firstName: appointment?.user?.firstName,
          clientEmail: appointment?.user?.email,
          status: appointment?.status,
        }),
      });

      const result = await res.json();
      if (result?.statusCode !== 200) {
        toast({
          description: `Error deleting appointment.`,
          variant: "destructive",
        });
      }
      if (isLoading) {
        toast({ description: "Deleting appointment..." });
      } else {
        toast({
          description: "Appointment deleted.",
        });
        mutate("/api/appointments");
      }
      mutate("/api/appointments");
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="h-full mb-4 md:mb-0 md:mr-4 rounded-md border shadow">
        <CalendarComponent
          appointments={data?.convertedAppointments}
          selectedDate={selectedDate.toJSDate()}
          onDateSelect={handleDateSelect}
          userRole="admin"
        />
      </div>

      {isLoading ? (
        <AppointmentSkeleton />
      ) : filteredAppointments?.length > 0 ? (
        <div className="mx-auto w-full">
          <div className="m-0 px-0 py-1 overflow-scroll h-80 overscroll-contain">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Time</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">User Info</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="tracking-widest">
                {appointmentsByDate?.map((appointment: any) => {
                  const { dateString, timeString } = formatDateAndTime(
                    appointment?.dateTime
                  );
                  const isBooked = appointment?.status === "booked";

                  return (
                    <TableRow key={appointment?.id} className="text-center ">
                      <TableCell className={isBooked ? "text-green-500" : ""}>
                        {dateString}
                      </TableCell>
                      <TableCell className={isBooked ? "text-green-500" : ""}>
                        {timeString}
                      </TableCell>
                      <TableCell className={isBooked ? "text-green-500" : ""}>
                        {isBooked ? "Booked" : "Available"}
                      </TableCell>
                      <TableCell>
                        {isBooked ? (
                          <Popover>
                            <PopoverTrigger className="underline underline-offset-2">
                              {appointment?.user?.firstName}
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="whitespace-normal overflow-auto">
                                <p>
                                  Name: {appointment?.user?.firstName}{" "}
                                  {appointment?.user?.lastName}
                                </p>
                                <p>Email: {appointment?.user?.email}</p>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button>Delete</Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogTitle>
                                      Confirm deletion
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this
                                      appoinment? An email will be sent to the
                                      client about the deletion.
                                      <br />
                                      <span className="text-red-500">
                                        This action cannot be undone.
                                      </span>
                                    </AlertDialogDescription>
                                    <AlertDialogCancel asChild>
                                      <Button
                                        size="sm"
                                        className="text-primary"
                                      >
                                        Cancel
                                      </Button>
                                    </AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                      <Button
                                        onClick={() => {
                                          handleDeleteAppointment(appointment);
                                        }}
                                      >
                                        Confirm
                                      </Button>
                                    </AlertDialogAction>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button>Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogTitle>
                                Confirm deletion
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this appoinment?
                                <br />
                                <span className="text-red-500">
                                  This action cannot be undone.
                                </span>
                              </AlertDialogDescription>
                              <AlertDialogCancel asChild>
                                <Button size="sm" className="text-primary">
                                  Cancel
                                </Button>
                              </AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <Button
                                  onClick={() => {
                                    handleDeleteAppointment(appointment);
                                  }}
                                >
                                  Confirm
                                </Button>
                              </AlertDialogAction>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-start w-full text-center mx-4">
          <div>
            No available appointments on:
            <br />
            <span className="tracking-widest text-muted-foreground">
              {DateTime.fromJSDate(selectedDate.toJSDate())
                .toLocal()
                .toJSDate()
                .toDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
