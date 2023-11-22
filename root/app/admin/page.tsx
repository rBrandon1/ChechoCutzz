"use client";

import AdminDashboard from "@/components/AdminDashboard";
import CreateAppointments from "@/components/CreateAppoinments";

export default function Admin() {
  return (
    <div>
      <h1 className="text-4xl italic font-bold mb-5">Admin Dashboard</h1>
      <div className="mb-5">
        <h2 className="text-2xl mb-5 text-center">Appointments</h2>
        <div>
          <AdminDashboard />
        </div>
      </div>
      <div>
        <h2 className="text-2xl mb-5 text-center">Create an appointment</h2>
        <div>
          <CreateAppointments />
        </div>
      </div>
    </div>
  );
}
