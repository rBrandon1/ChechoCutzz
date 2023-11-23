"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
import { useToast } from "@/components/ui/use-toast";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDateAndTime } from "@/lib/formatDateTime";

export default function CreateAppointments() {
  const { mutate } = useSWR("/api/appointments", fetcher);
  const { user, isLoading } = useKindeBrowserClient();
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    firstName: "",
    lastName: "",
    clientEmail: "",
    userId: "",
    status: "available",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && !formData.userId) {
      setFormData((fData) => ({
        ...fData,
        userId: user?.id as string,
      }));
    }
  }, [user, formData?.userId]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);

    const formattedTime = `${formData.date}T${formData.time}:00.000`;
    const localDateTime = moment(formattedTime);
    const pacificDateTimeISO = localDateTime.tz("America/Los_Angeles").format();

    const submissionData = {
      ...formData,
      dateTime: pacificDateTimeISO,
    };

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await res.json();
      if (result.statusCode === 409) {
        toast({
          description:
            "Error: An appointment already exists at this exact date and time.",
          variant: "destructive",
        });
      } else if (!res.ok) {
        toast({ description: "Error creating appointment." });
      } else if (isLoading) {
        toast({ description: "Creating appointment..." });
      } else {
        toast({
          description: "Appointment created successfully!",
        });
        mutate("/api/appointments");
      }

      setFormData({
        date: "",
        time: "",
        firstName: "",
        lastName: "",
        clientEmail: "",
        userId: "",
        status: "available",
      });
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleDialogSubmit = async () => {
    closeDialog();
    await handleSubmit();
  };

  const dateTime = formData?.date + "T" + formData?.time + ":00.000";

  const { dateString, timeString } = formatDateAndTime(dateTime);

  return (
    <div className="max-w-md mx-auto bg-transparent p-6 rounded-lg shadow-md">
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Creating Appointment</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="inline">
              <div>Booking the following appointment: </div>
              <div>
                Date:{" "}
                <span className="font-bold tracking-widest text-primary">
                  {dateString}
                </span>
                , Time:{" "}
                <span className="font-bold tracking-widest text-primary">
                  {timeString}
                </span>
              </div>
            </div>
          </AlertDialogDescription>
          <AlertDialogCancel asChild>
            <Button onClick={closeDialog} className="text-primary">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleDialogSubmit}>Proceed</Button>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      <form onSubmit={handleSubmit} className="space-y-4 mb-5">
        <div className="flex flex-col">
          <label htmlFor="date" className="text-sm font-medium">
            Date
          </label>
          <input
            className="mt-1 block w-full text-primary-foreground px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            type="date"
            id="date"
            name="date"
            value={formData?.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="time" className="text-sm font-medium">
            Time
          </label>
          <input
            className="mt-1 block w-full text-primary-foreground px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            type="time"
            id="time"
            name="time"
            value={formData?.time}
            onChange={handleChange}
            required
          />
        </div>
      </form>
      <div className="flex justify-center">
        <Button onClick={openDialog} disabled={isSubmitting}>
          Create Appointment
        </Button>
      </div>
    </div>
  );
}
