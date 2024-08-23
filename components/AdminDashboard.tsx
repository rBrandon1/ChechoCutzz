"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Appointment } from "@prisma/client";
import { ChevronLeft, ChevronRight, Cross, X } from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppointmentSkeleton from "./AppointmentSkeleton";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [newFirstName, setNewFirstName] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => {
    return DateTime.now().toLocal().startOf("week");
  });

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
        dateTime: appointment.dateTime,
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
  }, [selectedDate]);

  const handleDeleteAppointment = async (id: number) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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
        window.location.href = res.headers.get("Location") || "/admin";
      }
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const markAsBooked = async (id: number) => {
    try {
      const [firstName, lastName = ""] = newFirstName.split(" ");

      const res = await fetch(`api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "booked",
          firstName,
          lastName: lastName || "",
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
        window.location.href = res.headers.get("Location") || "/admin";
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

  const filterAppointments = (appointments: any) => {
    if (statusFilter === "all") return appointments;
    return appointments.filter((apt: any) => apt.status === statusFilter);
  };

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(DateTime.fromObject({ hour, minute }).toFormat("hh:mm a"));
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getAppointmentsForDay = (day: number) => {
    const appointmentDate = selectedDate.plus({ days: day });
    return convertedAppointments.filter((apt: any) =>
      DateTime.fromISO(apt.dateTime).hasSame(appointmentDate, "day")
    );
  };

  const sortAppointmentsIntoSlots = (appointments: any[]) => {
    const sortedSlots: { [key: string]: any[] } = {};
    appointments.forEach((apt) => {
      const aptTime = DateTime.fromISO(apt.dateTime).toFormat("hh:mm a");
      if (!sortedSlots[aptTime]) {
        sortedSlots[aptTime] = [];
      }
      sortedSlots[aptTime].push(apt);
    });
    return sortedSlots;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setSelectedDate((prev) =>
      prev.plus({ weeks: direction === "next" ? 1 : -1 })
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigateWeek("prev")}>
          <ChevronLeft />
        </button>
        <h2 className="text-lg font-semibold">
          Week of {selectedDate.toFormat("MMMM d, yyyy")}
        </h2>
        <button onClick={() => navigateWeek("next")}>
          <ChevronRight />
        </button>
      </div>
      <div className="mb-4">
        <Select onValueChange={setStatusFilter} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Appointments</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="available">Available</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {!convertedAppointments ? (
        <AppointmentSkeleton />
      ) : (
        <div className="w-full max-w-7xl mx-auto">
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-auto max-h-[50vh]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-20 bg-background sticky left-0 z-20">
                      Time
                    </TableHead>
                    {daysOfWeek.map((day, index) => {
                      const date = selectedDate.plus({ days: index });
                      const isToday = date.hasSame(DateTime.now(), "day");
                      return (
                        <TableHead
                          key={day}
                          className={`text-center min-w-[150px] ${
                            isToday ? "bg-muted" : ""
                          }`}
                        >
                          {day} {date.toFormat("MM/dd")}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeSlots.map((time) => (
                    <TableRow key={time}>
                      <TableCell className="font-medium bg-background sticky left-0 z-10">
                        {time}
                      </TableCell>
                      {daysOfWeek.map((_, dayIndex) => {
                        const dayDate = selectedDate.plus({ days: dayIndex });
                        const appointmentsForDay =
                          getAppointmentsForDay(dayIndex);
                        const sortedAppointments =
                          sortAppointmentsIntoSlots(appointmentsForDay);
                        const appointmentsForSlot = filterAppointments(
                          sortedAppointments[time] || []
                        );

                        return (
                          <TableCell
                            key={`${time}-${dayIndex}`}
                            className={`text-center min-w-[150px] ${
                              dayDate.hasSame(DateTime.now(), "day")
                                ? "bg-[#1f1f21]"
                                : ""
                            }`}
                          >
                            {appointmentsForSlot.length > 0 ? (
                              appointmentsForSlot.map(
                                (appointment: Appointment) => (
                                  <AlertDialog key={appointment.id}>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="link"
                                        className={`text-xs ${
                                          appointment.status === "booked"
                                            ? "text-green-500"
                                            : ""
                                        }`}
                                      >
                                        {appointment.status === "booked"
                                          ? `${appointment.firstName} ${appointment.lastName}`
                                          : appointment.status === "available"
                                          ? "Available"
                                          : "Unavailable"}
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <div className="flex items-center justify-between">
                                        <AlertDialogTitle>
                                          Appointment Details
                                        </AlertDialogTitle>
                                        <AlertDialogCancel className="border-none m-0 p-0">
                                          <X />
                                        </AlertDialogCancel>
                                      </div>
                                      <AlertDialogDescription>
                                        <p>
                                          Client: {appointment.firstName}{" "}
                                          {appointment.lastName}
                                        </p>
                                        <p>
                                          Time:{" "}
                                          {
                                            formatDateAndTime(
                                              appointment.dateTime
                                            ).timeString
                                          }
                                        </p>
                                        <p>
                                          Day:{" "}
                                          {DateTime.fromISO(
                                            appointment.dateTime.toString()
                                          ).toFormat("cccc")}
                                        </p>
                                        <p>
                                          Status:{" "}
                                          {appointment.status.toUpperCase()}
                                        </p>
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
                                      </AlertDialogDescription>
                                      <div className="flex justify-end space-x-2">
                                        {appointment.status === "available" && (
                                          <AlertDialogAction
                                            onClick={() => {
                                              if (newFirstName.length > 1) {
                                                markAsBooked(appointment.id);
                                              } else {
                                                toast({
                                                  description:
                                                    "Please enter a client name.",
                                                  variant: "destructive",
                                                });
                                              }
                                            }}
                                            className="text-black"
                                          >
                                            Mark as booked
                                          </AlertDialogAction>
                                        )}
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleNameChange(appointment)
                                          }
                                          className="text-secondary"
                                        >
                                          Update Name
                                        </AlertDialogAction>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteAppointment(
                                              appointment.id
                                            )
                                          }
                                          className="bg-destructive"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </div>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )
                              )
                            ) : statusFilter === "all" ? (
                              <span className="text-xs text-gray-400">
                                Unavailable
                              </span>
                            ) : statusFilter === "available" ? (
                              <span className="text-xs text-gray-400">
                                {""}
                              </span>
                            ) : null}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
