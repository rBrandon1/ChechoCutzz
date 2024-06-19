"use client";

import AdminDashboard from "@/components/AdminDashboard";
import CreateAppointments from "@/components/CreateAppoinments";

export default function Admin() {
  return (
    <div>
      <h1 className="text-4xl italic font-bold mb-5">Admin Dashboard</h1>
      {/* TODO allow price changes within admin dashboard */}
      {/* <div>
        <div>
          <h3>Current price: ${currentPrice}</h3>
        </div>
        <span>
          <h3>Set price: </h3>
          <input
            type="number"
            value={currentPrice}
            onChange={(e: any) => setCurrentPrice(e?.target.value)}
          />
        </span>
      </div> */}
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
