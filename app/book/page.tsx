"use client";

import DateSlider from "@/components/DateSlider";
import TimeSlots from "@/components/TimeSlots";
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
import { useToast } from "@/components/ui/use-toast";
import { formatDateAndTime } from "@/lib/formatDateTime";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookAppointment() {
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<DateTime>(
    DateTime.now().toLocal().startOf("day")
  );
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/appointments", {
          cache: "no-store",
          method: "GET",
        });

        const { appointments } = await res.json();

        const convertedAppointments = appointments?.map((appointment: any) => ({
          ...appointment,
          dateTime: DateTime.fromISO(appointment.dateTime).toISO(),
        }));
        setAppointments(convertedAppointments);

        const userRes = await fetch("/api/users/current", {
          cache: "no-store",
          method: "GET",
        });

        if (!userRes.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userRes.json();
        setUser(userData.user);
      } catch (error: any) {
        toast({
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/price", {
          cache: "no-store",
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch price");
        }

        const { price } = await res.json();
        setCurrentPrice(price);
      } catch (error: any) {
        toast({
          description: "Failed to fetch price",
          variant: "destructive",
        });
      }
    };

    fetchAppointments();
    fetchPrice();
  }, []);

  const handleDateSelect = (date: DateTime) => {
    setSelectedDate(date);
  };

  const bookAppointment = async (appointment: any) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const updatedData = {
      id: appointment.id,
      dateTime: appointment.dateTime,
      clientEmail: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: "booked",
    };

    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to book appointment");
      }

      return responseData.appointment;
    } catch (error) {
      throw error;
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedAppointment) return;
    
    if (!user) {
      toast({
        description: "Please sign in to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    toast({
      description: "Booking appointment...",
    });

    try {
      await bookAppointment(selectedAppointment);
      toast({
        description: "Appointment booked!",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const availableDates = appointments
    ?.filter((appointment: any) => {
      const appointmentDateTime = DateTime.fromISO(appointment?.dateTime).toLocal();
      return (
        appointmentDateTime >= DateTime.now().toLocal() &&
        appointment?.status === "available"
      );
    })
    .map((appointment: any) =>
      DateTime.fromISO(appointment.dateTime).toLocal().startOf("day")
    );

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 gradient-text">Book an Appointment</h1>
      <div className="mb-8">
        <h2 className="text-lg text-muted-foreground">
          Haircut - ${isLoading ? "..." : currentPrice}
        </h2>
      </div>

      <div className="space-y-8">
        {/* Date Selection */}
        <div>
          <h3 className="text-lg font-medium mb-4 gradient-text">Select a Date</h3>
          <DateSlider
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            availableDates={availableDates}
          />
        </div>

        {/* Time Selection */}
        <div>
          <h3 className="text-lg font-medium mb-4 gradient-text">Available Times</h3>
          <TimeSlots
            appointments={appointments}
            selectedDate={selectedDate}
            onSelectAppointment={(appointment) => {
              setSelectedAppointment(appointment);
            }}
          />
        </div>

        {/* Booking Button */}
        {selectedAppointment && (
          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" className="w-full md:w-auto">
                  Book Appointment
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>
                  Confirm appointment
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-2">
                    <p>Please confirm that you would like to book this appointment:</p>
                    <p className="font-medium">
                      {formatDateAndTime(selectedAppointment.dateTime).dateString}
                      {" at "}
                      {formatDateAndTime(selectedAppointment.dateTime).timeString}
                    </p>
                  </div>
                </AlertDialogDescription>
                <div className="flex justify-end gap-2">
                  <AlertDialogCancel asChild>
                    <Button variant="outline">Cancel</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button onClick={handleBookAppointment}>
                      Confirm Booking
                    </Button>
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
