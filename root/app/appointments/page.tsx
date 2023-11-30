"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { formatDateAndTime } from "@/lib/formatDateTime";
import AppointmentSkeleton from "@/components/AppointmentSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { DateTime } from "luxon";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function UserAppointments() {
  const { user, isLoading } = useKindeBrowserClient();
  const { data: appointmentsData, mutate } = useSWR(
    user ? `/api/appointments?userId=${user?.id}` : null,
    fetcher
  );
  const { toast } = useToast();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  useEffect(() => {
    if (appointmentsData?.convertedAppointments) {
      const now = DateTime.now().toLocal().toMillis();
      const sortedAppointments = appointmentsData?.convertedAppointments
        ?.map((appointment: any) => ({
          ...appointment,
          dateTime: DateTime.fromISO(appointment?.dateTime).toLocal().toISO(),
        }))
        .sort((a: any, b: any) => {
          return (
            DateTime.fromISO(a.dateTime).toLocal().toMillis() -
            DateTime.fromISO(b.dateTime).toLocal().toMillis()
          );
        });

      setUpcomingAppointments(
        sortedAppointments?.filter(
          (appointment: any) => new Date(appointment?.dateTime).getTime() > now
        )
      );
      setPreviousAppointments(
        sortedAppointments?.filter(
          (appointment: any) => new Date(appointment?.dateTime).getTime() <= now
        )
      );
    }
  }, [appointmentsData]);

  const handleCancelAppointment = async (
    appointmentId: string,
    dateTime: string,
    clientEmail: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const res = await fetch(`/api/appointments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: appointmentId,
          dateTime: dateTime,
          clientEmail,
          firstName,
          lastName,
          initiatedByUser: true,
        }),
      });

      const result = await res.json();
      if (result?.statusCode === 200) {
        toast({ description: "Appointment cancelled successfully." });
        mutate("/api/appointments");
      } else {
        toast({
          description: "Failed to cancel appointment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "An error occurred while cancelling the appointment.",
        variant: "destructive",
      });
    }
  };

  const renderAppointmentTable = (appointments: any) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Date</TableHead>
          <TableHead className="text-center">Time</TableHead>
          <TableHead className="text-center">Cancel</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments?.map((appointment: any) => {
          const { dateString, timeString } = formatDateAndTime(
            appointment?.dateTime
          );
          return (
            <TableRow key={appointment?.id} className="text-center">
              <TableCell>{dateString}</TableCell>
              <TableCell>{timeString}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>Cancel</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>Confirm Cancellation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this appoinment?
                      <br />
                      <span className="text-red-500">
                        {dateString} at {timeString}
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
                          handleCancelAppointment(
                            appointment?.id,
                            appointment?.dateTime,
                            appointment?.clientEmail,
                            appointment?.firstName,
                            appointment?.lastName
                          );
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
  );

  return (
    <div>
      <h1 className="text-4xl font-bold italic mb-10">Your Appointments</h1>
      <div className="text-center">
        <Tabs defaultValue="upcoming">
          <TabsList aria-label="Appointment Tabs">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="previous">Previous</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            {isLoading ? (
              <AppointmentSkeleton />
            ) : upcomingAppointments?.length > 0 ? (
              renderAppointmentTable(upcomingAppointments)
            ) : (
              <div>No upcoming appointments.</div>
            )}
          </TabsContent>
          <TabsContent value="previous">
            {previousAppointments?.length > 0 ? (
              renderAppointmentTable(previousAppointments)
            ) : (
              <div>
                <div>No previous appointments.</div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        <div className="mt-6 text-sm">
          Book your next appointment{" "}
          <Link
            href="/book-appointment"
            className="font-bold text-muted-foreground underline underline-offset-2"
          >
            here
          </Link>
        </div>
      </div>
    </div>
  );
}
