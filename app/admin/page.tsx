"use client";

import AdminDashboard from "@/components/AdminDashboard";
import CreateAppointments from "@/components/CreateAppoinments";
import TimeRangeSettingsForm from "@/components/TimeRangeSettingsForm";
import { UpdatePrice } from "@/components/UpdatePrice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Admin() {
  return (
    <div className="min-h-screen p-4 space-y-6 md:p-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent md:text-4xl">
          Admin Dashboard
        </h1>
        <div className="w-full max-w-sm">
          <UpdatePrice />
        </div>
      </div>
      <Separator className="my-6" />

      {/* Main Content */}
      <div className="space-y-6">
        {/* Calendar Section */}
        <Card className="border-muted bg-card">
          <CardHeader>
            <CardTitle>Appointments Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminDashboard />
          </CardContent>
        </Card>

        {/* Generate Appointments Card */}
        <Card className="border-muted bg-card">
          <CardHeader>
            <CardTitle>Generate 2-Week Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>* This will generate appointments for the next two weeks</p>
              <p>* This will override all appointments marked as available</p>
            </div>
            <TimeRangeSettingsForm />
          </CardContent>
        </Card>

        {/* Custom Appointments Card */}
        <Card className="border-muted bg-card">
          <CardHeader>
            <CardTitle>Create Custom Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateAppointments />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
