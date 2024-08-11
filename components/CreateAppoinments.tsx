"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateAppointments() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: "",
    firstName: "",
    lastName: "",
    clientEmail: "",
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

  const validateForm = () => {
    return formData?.date !== "" && times?.some((time) => time !== "");
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e?.target.name]: e?.target.value });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);

    let successCount = 0;
    let errorCount = 0;

    for (const time of times) {
      const dateTime = DateTime.fromISO(`${formData.date}T${time}`, {
        zone: "America/Los_Angeles",
      }).toUTC();
      const submissionData = {
        ...formData,
        dateTime: dateTime.toISO(),
      };

      try {
        const res = await fetch("/api/appointments/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        });

        const result = await res.json();
        if (!res.ok) {
          if (res.status === 409) {
            errorCount++;
            toast({
              description: `An appointment already exists at ${time}.`,
              variant: "destructive",
            });
          } else if (result.error === "Appointment date is in the past.") {
            errorCount++;
            toast({
              description:
                "Appointment date is in the past. Please select a future date.",
              variant: "destructive",
            });
          } else {
            errorCount++;
            toast({
              description: "Error creating appointment.",
              variant: "destructive",
            });
          }
        } else {
          successCount++;
          window.location.href = res.headers.get("Location") || "/admin";
        }
      } catch (error: any) {
        toast({
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }

    toast({ description: "Appointments created successfully!" });
    setFormData({
      date: "",
      firstName: "",
      lastName: "",
      clientEmail: "",
      status: "available",
    });
    setTimes([""]);
    router.refresh();
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
    <div className="max-w-md mx-auto bg-transparent pt-3 pb-6">
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
            <Button className="text-secondary" onClick={handleDialogSubmit}>
              Proceed
            </Button>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mb-6">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          className="text-white"
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
              className="text-primary"
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
        <Button
          className="p-0 h-7 flex items-center"
          onClick={addTime}
          variant="ghost"
        >
          Add Time
        </Button>
      </div>
      <div className="flex justify-center">
        <Button
          onClick={openDialog}
          disabled={isSubmitting}
          className="flex items-center"
          variant="secondary"
        >
          Create Appointments
        </Button>
      </div>
    </div>
  );
}
