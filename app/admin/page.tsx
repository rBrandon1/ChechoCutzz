"use client";

import AdminDashboard from "@/components/AdminDashboard";
import CreateAppointments from "@/components/CreateAppoinments";
import TimeRangeSettingsForm from "@/components/TimeRangeSettingsForm";
import { UpdatePrice } from "@/components/UpdatePrice";

export default function Admin() {
  return (
    <div>
      <h1 className="text-4xl italic mb-5">Admin Dashboard</h1>
      <div className="mb-10">
        <UpdatePrice />
      </div>
      <div className="mb-10">
        <h2 className="text-2xl mb-2 text-center">Appointments</h2>
        <AdminDashboard />
      </div>
      <div className="mb-16 border border-muted rounded-md p-2">
        <h2 className="text-2xl mb-2 text-center">Generate Appointments</h2>
        <h3 className="text-xs text-muted-foreground text-start">
          *This will generate appointments for the next two weeks
        </h3>
        <h3 className="text-xs text-muted-foreground text-start">
          *This will override all appointments marked as available
        </h3>
        <TimeRangeSettingsForm />
      </div>
      <div className="border border-muted rounded-md p-2">
        <h2 className="text-2xl text-center">Custom Appointments</h2>
        <CreateAppointments />
      </div>
    </div>
  );
}
