"use server";

import createServerSupabaseClient from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    let appointments;

    if (user?.user_metadata.user_metadata.role === "admin") {
      // Admin can see all appointments
      appointments = await prisma.appointment.findMany();
    } else {
      // Regular user can only see their appointments
      appointments = await prisma.appointment.findMany({
        where: {
          status: "available",
        },
      });
    }

    console.log({ appointments });

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    console.log("Error retrieving appointments:", error);
    return NextResponse.json(
      { error: "Error retrieving appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Admin role protection to page
  const user = session?.user;
  if (!session || user?.user_metadata.user_metadata.role !== "admin") {
    return NextResponse.redirect("/", { status: 302 });
  }

  const { dateTime, firstName, lastName, clientEmail } = await request.json();

  if (DateTime.fromISO(dateTime).toLocal() < DateTime.now().toLocal()) {
    return NextResponse.json(
      { error: "Appointment date is in the past" },
      { status: 400 }
    );
  }

  try {
    const appointment = await prisma.appointment.create({
      data: {
        dateTime,
        firstName,
        lastName,
        clientEmail,
        userId: user.id,
        status: "pending",
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.log("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Error creating appointment" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Admin role protection to page
  const user = session?.user;
  if (!session || user?.user_metadata.user_metadata.role !== "admin") {
    return NextResponse.redirect("/", { status: 302 });
  }

  const appointmentId = parseInt(params.id);
  const { dateTime, firstName, lastName, clientEmail, status } =
    await request.json();

  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    if (
      appointment.userId !== user.id &&
      user?.user_metadata.user_metadata !== "admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        dateTime,
        firstName,
        lastName,
        clientEmail,
        status,
      },
    });

    return NextResponse.json(
      { appointment: updatedAppointment },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Error updating appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Admin role protection to page
  const user = session?.user;
  if (!session || user?.user_metadata.user_metadata.role !== "admin") {
    return NextResponse.redirect("/", { status: 302 });
  }

  const appointmentId = parseInt(params.id);

  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    if (
      appointment.userId !== user.id &&
      user.user_metadata.user_metadata.role !== "admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.appointment.delete({
      where: {
        id: appointmentId,
      },
    });

    return NextResponse.json(
      { message: "Appointment deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Error deleting appointment" },
      { status: 500 }
    );
  }
}
