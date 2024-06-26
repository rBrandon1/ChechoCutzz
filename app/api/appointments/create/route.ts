import { prisma } from "@/lib/prisma";
import createServerSupabaseClient from "@/lib/supabase/server";
import { DateTime } from "luxon";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const { dateTime, firstName, lastName, clientEmail, status } =
      await request.json();

    const appointmentDateTime = DateTime.fromISO(dateTime).toUTC();

    // Check for existing appointments at the same date and time
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        dateTime: appointmentDateTime.toJSDate(),
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "An appointment already exists at this date and time" },
        { status: 409 }
      );
    }

    const utcDateTime = DateTime.fromISO(dateTime).toUTC().toJSDate();
    if (utcDateTime < new Date()) {
      return NextResponse.json({
        error: "Appointment date is in the past.",
        statusCode: 400,
      });
    }

    // If no existing appointment, create a new one
    const appointment = await prisma.appointment.create({
      data: {
        dateTime: appointmentDateTime.toJSDate(),
        firstName: firstName || "",
        lastName: lastName || "",
        clientEmail: clientEmail || "",
        status: status || "available",
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating appointment" },
      { status: 500 }
    );
  }
}
