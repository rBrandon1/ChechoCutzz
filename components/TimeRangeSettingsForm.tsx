import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useToast } from "./ui/use-toast";

type TimeRangeSettings = {
  weekdayStart: string;
  weekdayEnd: string;
  weekendStart: string;
  weekendEnd: string;
};

function formatTime(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

function parseTime(time: string): number {
  return parseInt(time.split(":")[0], 10);
}

export default function TimeRangeSettingsForm() {
  const { control, handleSubmit, setValue } = useForm<TimeRangeSettings>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/time-range-settings", { method: "GET" });
        if (res.ok) {
          const settings = await res.json();
          if (settings) {
            setValue("weekdayStart", formatTime(settings.weekdayStart));
            setValue("weekdayEnd", formatTime(settings.weekdayEnd));
            setValue("weekendStart", formatTime(settings.weekendStart));
            setValue("weekendEnd", formatTime(settings.weekendEnd));
          } else {
            setValue("weekdayStart", "10:00");
            setValue("weekdayEnd", "20:00");
            setValue("weekendStart", "08:00");
            setValue("weekendEnd", "20:00");
          }
        } else {
          toast({
            description: "Error fetching time range settings.",
            variant: "destructive",
          });
          setValue("weekdayStart", "10:00");
          setValue("weekdayEnd", "20:00");
          setValue("weekendStart", "08:00");
          setValue("weekendEnd", "20:00");
        }
      } catch (error: any) {
        toast({
          description: error.message,
          variant: "destructive",
        });
        setValue("weekdayStart", "10:00");
        setValue("weekdayEnd", "20:00");
        setValue("weekendStart", "08:00");
        setValue("weekendEnd", "20:00");
      }
    }
    fetchSettings();
  }, [setValue]);

  const onSubmit = async (data: TimeRangeSettings) => {
    setIsLoading(true);
    try {
      const settingsRes = await fetch("/api/time-range-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weekdayStart: parseTime(data.weekdayStart),
          weekdayEnd: parseTime(data.weekdayEnd),
          weekendStart: parseTime(data.weekendStart),
          weekendEnd: parseTime(data.weekendEnd),
        }),
      });

      if (!settingsRes.ok) {
        toast({
          description: "Error deleting appointment.",
          variant: "destructive",
        });
      }

      const appointmentsRes = await fetch("/api/generate-appointments", {
        method: "POST",
      });

      if (!appointmentsRes.ok) {
        toast({
          description: "Error generating appointments.",
          variant: "destructive",
        });
      }

      setIsDialogOpen(false);
      toast({
        description: "New times saved and appointments generated successfully.",
      });

      window.location.href = "/admin";
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form id="settingsForm" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="weekdayStart">Weekday Start Time</Label>
          <Controller
            name="weekdayStart"
            control={control}
            render={({ field }) => <Input type="time" {...field} />}
          />
        </div>
        <div>
          <Label htmlFor="weekdayEnd">Weekday End Time</Label>
          <Controller
            name="weekdayEnd"
            control={control}
            render={({ field }) => <Input type="time" {...field} />}
          />
        </div>
        <div>
          <Label htmlFor="weekendStart">Weekend Start Time</Label>
          <Controller
            name="weekendStart"
            control={control}
            render={({ field }) => <Input type="time" {...field} />}
          />
        </div>
        <div>
          <Label htmlFor="weekendEnd">Weekend End Time</Label>
          <Controller
            name="weekendEnd"
            control={control}
            render={({ field }) => <Input type="time" {...field} />}
          />
        </div>
      </form>

      <div>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <div>
              <Button
                disabled={isLoading}
                onClick={() => setIsDialogOpen(true)}
                className="text-black mt-5 h-8 w-full flex justify-center items-center text-secondary"
              >
                {isLoading ? "Generating..." : "Generate Appointments"}
              </Button>
              <div className="text-sm text-slate-500">
                {isLoading ? "This may take up to 3 minutes..." : ""}
              </div>
              <div className="text-sm text-red-500">
                {isLoading ? "DO NOT REFRESH" : ""}
              </div>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Confirm Settings</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to generate new appointments?
            </AlertDialogDescription>
            <div className="flex justify-end space-x-2">
              <AlertDialogCancel asChild>
                <Button className="bg-primary text-secondary">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  className="text-secondary"
                  onClick={() =>
                    (
                      document.getElementById("settingsForm") as HTMLFormElement
                    )?.requestSubmit()
                  }
                >
                  Yes
                </Button>
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
