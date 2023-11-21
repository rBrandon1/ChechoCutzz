"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { formatDateAndTime } from "@/lib/formatDateTime";

export default function BookAppointment() {
  const { user, isLoading } = useKindeBrowserClient();
  const { data, error, mutate } = useSWR(
    "http://localhost:3000/api/appointments",
    fetcher
  );
  const [message, setMessage] = useState("");

  const bookAppointment = async (appointment: any) => {
    try {
      const updatedData = {
        id: appointment.id,
        userId: user?.id,
        clientName: user?.given_name,
        dateTime: appointment.dateTime,
        clientEmail: user?.email,
        status: "booked",
      };

      const res = await fetch("http://localhost:3000/api/appointments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(errorData.message || "Error booking appointment.");
      }

      mutate((currentData: any) => {
        return {
          ...currentData,
          appointments: currentData.appointments.map((app: any) =>
            app.id === appointment.id ? { ...app, ...updatedData } : app
          ),
        };
      }, false);

      if (isLoading) setMessage("Booking appointment...");
      setMessage("Appointment booked successfully.");
    } catch (error: any) {
      console.log("ERROR", error.message);
    }
  };

  if (error) return <div>Failed to load appointments.</div>;
  return (
    <div>
      <h1>Book an Appointment</h1>
      {isLoading && <div>Loading...</div>}
      <ul>
        {data?.appointments.map((appointment: any) => {
          const { dateString, timeString } = formatDateAndTime(
            appointment.dateTime
          );
          return appointment.status === "available" ? (
            <li key={appointment.id}>
              {dateString} at {timeString}{" "}
              <button onClick={() => bookAppointment(appointment)}>Book</button>
            </li>
          ) : (
            data && appointment.status === "available" && (
              <div>No current appointments available.</div>
            )
          );
        })}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
}
