"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
export default function CreateAppointments() {
  const { user, isLoading } = useKindeBrowserClient();
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    clientName: "",
    clientEmail: "",
    userId: "",
    status: "available",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user && !formData.userId) {
      setFormData((fData) => ({
        ...fData,
        userId: user?.id as string,
      }));
    }
  }, [user, formData.userId]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedTime = `${formData.date}T${formData.time}:00.000`;
    const localDateTime = moment(formattedTime);
    const pacificDateTimeISO = localDateTime.tz("America/Los_Angeles").format();

    const submissionData = {
      ...formData,
      dateTime: pacificDateTimeISO,
    };
    try {
      const res = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
      const data = await res.json();

      if (!res.ok) setMessage(data.statusText || "Error");
      if (isLoading) return <div>Loading...</div>;

      setMessage("Appointment created successfully.");
      setFormData({
        date: "",
        time: "",
        clientName: "",
        clientEmail: "",
        userId: "",
        status: "available",
      });
      if (!isLoading) setMessage("");
    } catch (error: any) {
      setMessage("Failed to create appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Create New Appointments</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          Create Appointment
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
