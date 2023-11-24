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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

  const dateTime = formData?.date + "T" + formData?.time + ":00.000";
  const { dateString, timeString } = formatDateAndTime(dateTime);

  useEffect(() => {
    if (user && !formData.userId) {
      setFormData((fData) => ({
        ...fData,
        userId: user?.id as string,
      }));
    }
  }, [user, formData?.userId]);

  const validateForm = () => {
    return formData?.date === "" || formData?.time === "" ? false : true;
  };

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
          description: `Appointment created successfully for ${dateString} at ${timeString}!`,
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

  const openDialog = () => {
    if (!validateForm()) {
      toast({
        description: "Please select a date and time.",
        variant: "destructive",
      });
      return;
    }
    setIsDialogOpen(true);
  };
  const closeDialog = () => setIsDialogOpen(false);

  const handleDialogSubmit = async () => {
    closeDialog();
    await handleSubmit();
  };

  return (
    <div className="max-w-md mx-auto bg-transparent pt-3 pb-6 rounded-lg shadow-md">
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

      <div className="mb-6 flex justify-evenly">
        <div className="flex justify-center mb-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              className="text-primary-foreground"
              type="date"
              value={formData?.date}
              name="date"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              className="text-primary-foreground"
              type="time"
              name="time"
              value={formData?.time}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <Button onClick={openDialog} disabled={isSubmitting}>
          Create Appointment
        </Button>
      </div>
    </div>
  );
}
