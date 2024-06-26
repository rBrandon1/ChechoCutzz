"use client";

import AdminDashboard from "@/components/AdminDashboard";
import CreateAppointments from "@/components/CreateAppoinments";
import { UpdatePrice } from "@/components/UpdatePrice";

export default function Admin() {
  return (
    <div>
      <h1 className="text-4xl italic mb-5">Admin Dashboard</h1>
      <div className="mb-5">
        <UpdatePrice />
      </div>
      <div className="mb-5">
        <h2 className="text-2xl mb-5 text-center">Appointments</h2>
        <AdminDashboard />
      </div>
      <div>
        <h2 className="text-2xl text-center">Create appointments</h2>
        <CreateAppointments />
      </div>
    </div>
  );
}
