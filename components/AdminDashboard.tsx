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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Appointment } from "@prisma/client";
import { ChevronLeft, ChevronRight, Pencil, X } from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [newFirstName, setNewFirstName] = useState("");
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => {
    return DateTime.now().toLocal().startOf("week");
  });
  const [convertedAppointments, setConvertedAppointments] = useState<
    Appointment[]
  >([]);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments", {
        cache: "no-store",
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const { appointments } = await res.json();
      setConvertedAppointments(
        appointments.map((apt: Appointment) => ({
          ...apt,
          status: apt.status.toLowerCase(),
        }))
      );
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

  const handleDeleteAppointment = async (id: number) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete appointment");
      }

      toast({
        description: "Appointment deleted.",
      });

      // Force a page refresh
      window.location.reload();
    } catch (error) {
      toast({
        description: "Error deleting appointment.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAppointment = async (
    id: number,
    updates: { firstName?: string; status?: string }
  ) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updates,
          dateTime: editingAppointment?.dateTime,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update appointment");
      }

      toast({
        description: "Appointment updated.",
      });
      setNewFirstName("");
      setEditName("");
      setEditingAppointment(null);
      await fetchAppointments();
    } catch (error) {
      toast({
        description: "Error updating appointment.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateAppointments = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch("/api/appointments/create", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to generate appointments");
      }

      toast({
        description: "Appointments generated successfully.",
      });

      // Refresh appointments
      await fetchAppointments();
    } catch (error) {
      toast({
        description: "Error generating appointments.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredAppointments = convertedAppointments.filter((appointment) => {
    return (
      statusFilter === "all" ||
      appointment.status === statusFilter.toLowerCase()
    );
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "text-lime-500";
      case "booked":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const groupAppointmentsByDate = (appointments: Appointment[]) => {
    return appointments.reduce<Record<string, Appointment[]>>(
      (acc, appointment) => {
        const dateStr =
          typeof appointment.dateTime === "string"
            ? appointment.dateTime
            : appointment.dateTime.toISOString();

        const date = DateTime.fromISO(dateStr).toISODate();
        if (date && !acc[date]) {
          acc[date] = [];
        }
        if (date) {
          acc[date].push(appointment);
        }
        return acc;
      },
      {}
    );
  };

  const appointmentsByDate = Object.entries(
    groupAppointmentsByDate(filteredAppointments)
  ).reduce<Record<string, Appointment[]>>((acc, [date, appointments]) => {
    // Sort appointments by time for each date
    acc[date] = appointments.sort((a, b) => {
      const timeA = DateTime.fromISO(a.dateTime.toString()).toMillis();
      const timeB = DateTime.fromISO(b.dateTime.toString()).toMillis();
      return timeA - timeB;
    });
    return acc;
  }, {});

  const formatAppointmentDateTime = (dateTime: Date | string) => {
    const dateStr =
      typeof dateTime === "string" ? dateTime : dateTime.toISOString();
    return DateTime.fromISO(dateStr);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = selectedDate.minus({ weeks: 1 });
              setSelectedDate(newDate);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            {selectedDate.toFormat("MMMM d")} -{" "}
            {selectedDate.plus({ days: 6 }).toFormat("MMMM d, yyyy")}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = selectedDate.plus({ weeks: 1 });
              setSelectedDate(newDate);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {[...Array(7)].map((_, index) => {
          const date = selectedDate.plus({ days: index });
          const dateStr = date.toISODate();
          const appointments = appointmentsByDate[dateStr] || [];

          return (
            <Card key={dateStr}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="font-semibold">
                    {date.toFormat("EEEE")}
                    <div className="text-sm font-normal text-muted-foreground">
                      {date.toFormat("LLL d")}
                    </div>
                  </div>
                  <ScrollArea className="h-[340px] w-full">
                    <div className="space-y-2 pr-4">
                      {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="p-2 rounded-md bg-background hover:bg-accent cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    getStatusBadgeColor(appointment.status)
                                  )}
                                >
                                  {appointment.status}
                                </Badge>
                                <div className="text-sm mt-1">
                                  {formatAppointmentDateTime(
                                    appointment.dateTime
                                  ).toFormat("h:mm a")}
                                </div>
                                {appointment.firstName && (
                                  <div className="text-sm font-medium truncate">
                                    {appointment.firstName}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditName(
                                          appointment.firstName || ""
                                        );
                                        setEditingAppointment(appointment);
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        {appointment.firstName
                                          ? `${appointment.firstName}'s Appointment`
                                          : "Appointment Details"}
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label>Client Name</Label>
                                        <Input
                                          value={editName}
                                          onChange={(e) =>
                                            setEditName(e.target.value)
                                          }
                                          placeholder="Enter client name"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select
                                          value={
                                            editStatus || appointment.status
                                          }
                                          onValueChange={(value) => {
                                            setEditStatus(value);
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="available">
                                              Available
                                            </SelectItem>
                                            <SelectItem value="booked">
                                              Booked
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Date & Time</Label>
                                        <div>
                                          {formatAppointmentDateTime(
                                            appointment.dateTime
                                          ).toFormat("DDDD")}
                                          {" at "}
                                          {formatAppointmentDateTime(
                                            appointment.dateTime
                                          ).toFormat("h:mm a")}
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Current Client Name</Label>
                                        <div>
                                          {appointment.firstName ||
                                            "Not booked"}
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Client Email</Label>
                                        <div>
                                          {appointment.clientEmail ||
                                            "Not provided"}
                                        </div>
                                      </div>
                                      <div className="flex justify-end">
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            const updates: {
                                              firstName?: string;
                                              status?: string;
                                            } = {};

                                            if (editName.trim()) {
                                              updates.firstName = editName;
                                            }

                                            if (editStatus) {
                                              updates.status = editStatus;
                                            }

                                            if (
                                              Object.keys(updates).length > 0
                                            ) {
                                              handleUpdateAppointment(
                                                appointment.id,
                                                updates
                                              );
                                              setEditStatus("");
                                            }
                                          }}
                                        >
                                          Save
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogTitle>
                                      Delete Appointment
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this
                                      appointment?
                                    </AlertDialogDescription>
                                    <div className="flex justify-end space-x-2">
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteAppointment(
                                            appointment.id
                                          )
                                        }
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </div>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                          No appointments for this day
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full"
                disabled={isGenerating}
              >
                Generate 2 Week Appointments
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Generate Appointments</AlertDialogTitle>
              <AlertDialogDescription>
                This will generate appointments for the next 2 weeks. Are you
                sure you want to continue?
              </AlertDialogDescription>
              <div className="flex justify-end space-x-2">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleGenerateAppointments}>
                  {isGenerating ? "Generating..." : "Generate"}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
