"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/components/ui/use-toast";
import { formatDateAndTime } from "@/lib/formatDateTime";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppointmentSkeleton from "./AppointmentSkeleton";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [newFirstName, setNewFirstName] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    DateTime.now().toLocal().startOf("day")
  );

  const [convertedAppointments, setConvertedAppointments] = useState([]);
  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments", {
        cache: "no-store",
        method: "GET",
      });

      const { appointments } = await res.json();

      const mappedAppointments = appointments.map((appointment: any) => ({
        ...appointment,
        dateTime: DateTime.fromISO(appointment.dateTime).toISO(),
      }));

      setConvertedAppointments(mappedAppointments);
    } catch (error) {
      toast({
        description: "Failed to load appointments. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(
      DateTime.fromJSDate(date).toLocal().startOf("day") as DateTime<true>
    );
  };

  const filteredAppointments = convertedAppointments
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

  const appointmentsByDate = convertedAppointments?.filter(
    (appointment: any) => {
      return DateTime.fromISO(appointment?.dateTime)
        .toLocal()
        .hasSame(selectedDate, "day");
    }
  );

  const handleDeleteAppointment = async (appointment: any) => {
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: appointment.id }),
      });

      if (!res.ok) {
        toast({
          description: "Error deleting appointment.",
          variant: "destructive",
        });
      } else {
        toast({
          description: "Appointment deleted.",
        });
        await fetchAppointments();
        router.refresh();
      }
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const markAsBooked = async (appointment: any) => {
    try {
      const res = await fetch(`api/appointments/${appointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "booked",
        }),
      });

      if (!res.ok) {
        toast({
          description: "Error marking appointment as booked.",
          variant: "destructive",
        });
      } else {
        toast({
          description: "Marked as booked!",
        });
        router.refresh();
      }
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      });
      await fetchAppointments();
      router.refresh();
    }
  };

  const handleNameChange = async (appointment: any) => {
    try {
      const [firstName, lastName = ""] = newFirstName.split(" ");

      const res = await fetch(`api/appointments/${appointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName: lastName || "",
        }),
      });

      if (!res.ok) {
        toast({
          description: "Error updating appointment.",
          variant: "destructive",
        });
      } else {
        toast({ description: "Appointment updated successfully!" });
        await fetchAppointments();
        router.refresh();
      }
    } catch (error: any) {
      toast({ description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex justify-center h-full mb-4 md:mb-0 md:mr-4 rounded-md border shadow">
        <CalendarComponent
          appointments={convertedAppointments}
          selectedDate={selectedDate.toJSDate()}
          onDateSelect={handleDateSelect}
          userRole="admin"
        />
      </div>

      {!convertedAppointments ? (
        <AppointmentSkeleton />
      ) : filteredAppointments?.length > 0 ? (
        <div className="flex justify-center mx-auto w-full">
          <div className="m-0 px-0 pt-1 pb-5 overflow-scroll h-auto overscroll-contain">
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
                  const isBooked = appointment.status === "booked";

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
                              View
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="whitespace-normal overflow-auto">
                                <div className="pb-6">
                                  <div>
                                    <span className="text-md text-slate-500">
                                      Name:{" "}
                                    </span>
                                    <span className="text-sm">
                                      {appointment.firstName}{" "}
                                      {appointment.lastName}
                                    </span>
                                  </div>

                                  <div>
                                    <span className="text-md text-slate-500">
                                      Email:{" "}
                                    </span>
                                    <span className="text-sm">
                                      {appointment.clientEmail}
                                    </span>
                                  </div>
                                </div>
                                <div className="grid grid-flow-col gap-2 items-center">
                                  <Label htmlFor="newName">New name</Label>
                                  <Input
                                    id="newName"
                                    type="text"
                                    placeholder="New name"
                                    className="w-full h-8 bg-popover"
                                    value={newFirstName}
                                    onChange={(e) =>
                                      setNewFirstName(e?.target?.value)
                                    }
                                  />
                                  <Button
                                    className="h-8 flex justify-center items-center text-secondary"
                                    onClick={() =>
                                      handleNameChange(appointment)
                                    }
                                  >
                                    Update
                                  </Button>
                                </div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <div className="pt-6">
                                      <Button className="bg-red-500 w-full ">
                                        Delete
                                      </Button>
                                    </div>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogTitle>
                                      Confirm Deletion
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this
                                      appointment? An email will be sent to the
                                      client about the deletion.
                                      <br />
                                      <span className="text-red-500">
                                        This action cannot be undone.
                                      </span>
                                    </AlertDialogDescription>
                                    <AlertDialogCancel
                                      asChild
                                      className="flex justify-center items-center"
                                    >
                                      <Button
                                        size="sm"
                                        className="text-primary"
                                      >
                                        Cancel
                                      </Button>
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      asChild
                                      className="w-full bg-red-500"
                                    >
                                      <Button
                                        onClick={() =>
                                          handleDeleteAppointment(
                                            appointment.id
                                          )
                                        }
                                      >
                                        Delete
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
                              <Button className="text-black">Edit</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogTitle>
                                Edit Appointment
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Would you like to delete or mark this
                                appointment as booked?
                                <br />
                                <span className="text-red-500">
                                  This action cannot be undone.
                                </span>
                              </AlertDialogDescription>
                              <AlertDialogCancel
                                asChild
                                className="flex items-center justify-center"
                              >
                                <Button size="sm" className="text-primary">
                                  Cancel
                                </Button>
                              </AlertDialogCancel>
                              <div className="flex justify-between gap-4 items-center">
                                <AlertDialogAction
                                  asChild
                                  className="w-full bg-red-500"
                                >
                                  <Button
                                    onClick={() =>
                                      handleDeleteAppointment(appointment)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </AlertDialogAction>
                                <AlertDialogAction asChild className="w-full">
                                  <Button
                                    onClick={() => markAsBooked(appointment)}
                                    className="text-black"
                                  >
                                    Mark as booked
                                  </Button>
                                </AlertDialogAction>
                              </div>
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
        <div className="flex items-center justify-center md:justify-start w-full text-center mx-4">
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
  );
}
