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
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function UserAppointments() {
  const { user, isLoading } = useKindeBrowserClient();
  const { data } = useSWR(
    user ? `/api/appointments?userId=${user?.id}` : null,
    fetcher
  );
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);

  useEffect(() => {
    if (data?.appointments) {
      const sortedAppointments = data?.appointments?.sort(
        (a: any, b: any) =>
          new Date(a?.dateTime).getTime() - new Date(b?.dateTime).getTime()
      );
      const now = new Date().getTime();
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
  }, [data]);

  const renderAppointmentTable = (appointments: any) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Date</TableHead>
          <TableHead className="text-center">Time</TableHead>
          <TableHead className="text-center">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment: any) => {
          const { dateString, timeString } = formatDateAndTime(
            appointment?.dateTime
          );
          return (
            <TableRow key={appointment?.id} className="text-center">
              <TableCell>{dateString}</TableCell>
              <TableCell>{timeString}</TableCell>
              <TableCell>{appointment?.status}</TableCell>
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
              <div>
                <div>No upcoming appointments.</div>
                <div>
                  Book your next appointment{" "}
                  <Link
                    href="/book-appointment"
                    className="font-bold text-muted-foreground underline underline-offset-2"
                  >
                    here
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="previous">
            {previousAppointments?.length > 0 ? (
              renderAppointmentTable(previousAppointments)
            ) : (
              <div>
                <div>No previous appointments.</div>
                <div>
                  Book your next appointment{" "}
                  <Link
                    href="/book-appointment"
                    className="font-bold text-muted-foreground underline underline-offset-2"
                  >
                    here
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
