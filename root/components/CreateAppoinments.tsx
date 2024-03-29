"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useAuth from "@/lib/useAuth";

export default function CreateAppointments() {
  const { mutate } = useSWR("/api/appointments", fetcher);
  const { user, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    date: "",
    firstName: "",
    lastName: "",
    clientEmail: "",
    userId: "",
    status: "available",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [times, setTimes] = useState([""]);
  const addTime = () => {
    setTimes([...times, ""]);
  };
  const removeTime = (index: number) => {
    const newTimes = times.filter((_, i) => i !== index);
    setTimes(newTimes);
  };
  const handleTimeChange = (time: string, index: number) => {
    const newTimes = [...times];
    newTimes[index] = time;
    setTimes(newTimes);
  };

  useEffect(() => {
    if (user && !formData?.userId) {
      setFormData((fData) => ({
        ...fData,
        userId: user?.id as string,
      }));
    }
  }, [user, formData?.userId]);

  const validateForm = () => {
    return formData?.date !== "" && times?.some((time) => time !== "");
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e?.target.name]: e?.target.value });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);

    for (const time of times) {
      const dateTime = DateTime.fromISO(`${formData.date}T${time}`, {
        zone: "America/Los_Angeles",
      }).toUTC();
      const submissionData = {
        ...formData,
        dateTime: dateTime.toISO(),
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
        if (result?.statusCode === 500) {
          toast({ description: "Error creating appointment." });
          mutate("/api/appointments");
          break;
        } else if (result?.statusText === "Duplicate appointment exists.") {
          toast({
            description:
              "An appointment already exists at this exact date and time.",
            variant: "destructive",
          });
          break;
        } else if (result?.statusText === "Appointment date is in the past.") {
          toast({
            description:
              "Appointment date is in the past. Please select a future date.",
            variant: "destructive",
          });
        } else if (isLoading) {
          toast({ description: "Creating appointments..." });
        }
        mutate("/api/appointments");
      } catch (error: any) {
        toast({
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }

    if (isLoading) toast({ description: "Creating appointments..." });

    toast({ description: "Appointments created successfully!" });
    setFormData({
      date: "",
      firstName: "",
      lastName: "",
      clientEmail: "",
      userId: "",
      status: "available",
    });
    setTimes([""]);
    setIsSubmitting(false);
    mutate("/api/appointments");
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
              <div>Creating the following appointment: </div>
              <div>
                Date:{" "}
                <span className="font-bold text-sm tracking-widest text-primary">
                  {DateTime.fromISO(formData?.date, {
                    zone: "America/Los_Angeles",
                  })
                    .toJSDate()
                    .toDateString()}
                </span>{" "}
                <br />
                Time:{" "}
                <span className="font-bold text-sm tracking-widest text-primary">
                  {times
                    .filter((t) => t !== "")
                    .map((time) => {
                      const [hours, minutes] = time?.split(":");
                      const hours12 = parseInt(hours) % 12 || 12;
                      const amPm = parseInt(hours) < 12 ? "AM" : "PM";
                      return `${hours12}:${minutes} ${amPm}`;
                    })
                    .join(", ")}
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

      <div className="mb-6">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          className="text-primary-foreground"
          type="date"
          min={DateTime.now()
            .setZone("America/Los_Angeles")
            .startOf("day")
            .toFormat("yyyy-MM-dd")}
          value={formData?.date}
          name="date"
          onChange={handleChange}
        />
      </div>

      {times.map((time, index) => (
        <div key={index} className="mb-3 flex items-center">
          <div className="flex-grow">
            <Label htmlFor={`time-${index}`}>Time {index + 1}</Label>
            <Input
              id={`time-${index}`}
              className="text-primary-foreground"
              type="time"
              value={time}
              onChange={(e) => handleTimeChange(e?.target?.value, index)}
            />
          </div>
          {times.length > 1 && (
            <div className="mt-5">
              <Button
                className="h-7 text-sm flex items-center"
                onClick={() => removeTime(index)}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      ))}

      <div className="my-6 text-sm">
        <Button className="h-7 flex items-center" onClick={addTime}>
          Add Time
        </Button>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={openDialog}
          disabled={isSubmitting}
          className="flex items-center"
        >
          Create Appointments
        </Button>
      </div>
    </div>
  );
}
