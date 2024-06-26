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
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments/user");
      if (!res.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await res.json();
      setAppointments(data.appointments);
    } catch (error: any) {
      toast({
        description: "Failed to load appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}/cancel`, {
        method: "PUT",
      });
      if (!res.ok) {
        throw new Error("Failed to cancel appointment");
      }
      toast({
        description: "Appointment cancelled successfully.",
      });
      fetchAppointments();
    } catch (error) {
      toast({
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const upcomingAppointments = appointments
    .filter(
      (appointment: any) =>
        DateTime.fromISO(appointment.dateTime) > DateTime.now()
    )
    .sort(
      (a: any, b: any) =>
        DateTime.fromISO(a.dateTime).toMillis() -
        DateTime.fromISO(b.dateTime).toMillis()
    );

  const pastAppointments = appointments
    .filter(
      (appointment: any) =>
        DateTime.fromISO(appointment.dateTime) <= DateTime.now()
    )
    .sort(
      (a: any, b: any) =>
        DateTime.fromISO(b.dateTime).toMillis() -
        DateTime.fromISO(a.dateTime).toMillis()
    );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl italic mb-5">My Appointments</h1>
      <div>
        <Button className="mt-1 mb-8 text-secondary bg-ring" asChild>
          <Link href="/book">Book New Appointment</Link>
        </Button>
      </div>
      <h2 className="text-xl font-semibold mb-2">Upcoming Appointments</h2>
      {upcomingAppointments.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Cancel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingAppointments.map((appointment: any) => {
              const { dateString, timeString } = formatDateAndTime(
                appointment.dateTime
              );
              return (
                <TableRow key={appointment.id}>
                  <TableCell>{dateString}</TableCell>
                  <TableCell>{timeString}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-destructive">Cancel</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>
                          Confirm Cancellation
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this appoinment?
                          <br />
                          <span className="text-primary font-sans">
                            {dateString} at {timeString}
                          </span>
                        </AlertDialogDescription>
                        <AlertDialogCancel asChild>
                          <Button>No</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            className="bg-destructive"
                            onClick={() => {
                              handleCancelAppointment(appointment.id);
                            }}
                          >
                            Yes
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
        <p>No upcoming appointments</p>
      )}
      <h2 className="text-xl font-semibold mt-6 mb-2">Past Appointments</h2>
      {pastAppointments.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pastAppointments.map((appointment: any) => {
              const { dateString, timeString } = formatDateAndTime(
                appointment.dateTime
              );
              return (
                <TableRow key={appointment.id}>
                  <TableCell>{dateString}</TableCell>
                  <TableCell>{timeString}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <p>No past appointments</p>
      )}
    </div>
  );
}
