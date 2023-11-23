"use client";

import AdminDashboard from "@/components/AdminDashboard";
import CreateAppointments from "@/components/CreateAppoinments";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function Admin() {
  const [newPrice, setNewPrice] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrice) {
      return;
    }

    try {
      const res = await fetch("/api/appointment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price: newPrice }),
      });

      if (!res.ok) {
        toast({ description: "Error updating price." });
      }
      toast({ description: "Price updated successfully!" });
      setNewPrice("");
    } catch (error) {
      toast({ description: "An error occurred." });
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl italic font-bold mb-5">Admin Dashboard</h1>

      <div className="mb-5">
        <h2 className="text-2xl mb-5 text-center">Appointments</h2>
        <AdminDashboard />
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
        <div className="md:w-1/2">
          <h2 className="text-2xl text-center mb-4">Create an appointment</h2>
          <CreateAppointments />
        </div>
        <hr className="mb-5" />
        <div className="w-auto">
          <h2 className="text-2xl text-center mb-4">Set new price</h2>
          <div className="p-6 max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label htmlFor="price" className="text-sm font-medium">
                  Haircut Price
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-3 left-0 pl-3 text-primary-foreground">
                    $
                  </span>
                  <input
                    className="mt-1 px-3 py-2 pl-7 w-full text-primary-foreground rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    type="text"
                    id="price"
                    placeholder="25"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                  />
                  <div className="flex justify-center mt-5">
                    <Button type="submit">Set New Price</Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
