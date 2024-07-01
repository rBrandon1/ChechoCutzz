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
      <div className="mb-16">
        <h2 className="text-2xl mb-2 text-center">Update Times</h2>
        <TimeRangeSettingsForm />
      </div>
      <div>
        <h2 className="text-2xl text-center">Custom Appointments</h2>
        <CreateAppointments />
      </div>
    </div>
  );
}
