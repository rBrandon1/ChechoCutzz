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

export default function AdminDashboard() {
  const { isLoading } = useKindeBrowserClient();
  const { data, mutate } = useSWR("/api/appointments", fetcher);
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateSelect = (date: any) => {
    setSelectedDate(date);
  };
  const filteredAppointments = data?.appointments
    ?.filter((appointment: any) => {
      const appointmentDate = new Date(appointment?.dateTime).toDateString();
      return appointmentDate === selectedDate?.toDateString();
    })
    .sort((a: any, b: any) => {
      const timeA = new Date(a.dateTime).getTime();
      const timeB = new Date(b.dateTime).getTime();
      return timeA - timeB;
    });

  const appointmentsByDate = data?.appointments?.filter((appointment: any) => {
    return (
      new Date(appointment?.dateTime).toDateString() ===
      selectedDate?.toDateString()
    );
  });

  const handleDeleteAppointment = async (appointment: any) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: appointment?.id,
          clientEmail: appointment?.user?.email,
          firstName: appointment?.user?.given_name,
          dateTime: appointment?.dateTime,
        }),
      });
      if (!res.ok) toast({ description: "Error deleting appointment." });
      toast({
        description: "Appointment deleted.",
      });
      mutate("/api/appointments");
    } catch (error: any) {
      toast({
        description: "Error deleting appointment, try again.",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="mb-4 md:mb-0 md:mr-4 rounded-md border shadow">
        <CalendarComponent
          appointments={data?.appointments}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          filterMode="all"
        />
      </div>
      <div className="mx-4 flex-grow">
        {isLoading ? (
          <AppointmentSkeleton />
        ) : filteredAppointments?.length > 0 ? (
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
                  <TableRow key={appointment?.id} className="text-center">
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
                      {isBooked && (
                        <Popover>
                          <PopoverTrigger className="underline underline-offset-2">
                            {appointment?.user?.firstName}
                          </PopoverTrigger>
                          <PopoverContent>
                            <div>
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
                                    appoinment? This action cannot be undone. An
                                    email will be sent to the client about the
                                    deletion.
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
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-lg">
            <h1>No appointments available on this day.</h1>
          </div>
        )}
      </div>
    </div>
  );
}
