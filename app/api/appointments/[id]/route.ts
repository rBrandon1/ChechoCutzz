"use server";
import { sendAdminNotification, sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import createServerSupabaseClient from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { dateTime, firstName, lastName, clientEmail, status } =
    await request.json();
  const id = params.id;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    if (
      user.role !== "admin" &&
      status === "booked" &&
      appointment.status !== "available"
    ) {
      return NextResponse.json(
        { error: "Appointment is not available" },
        { status: 400 }
      );
    }

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: parseInt(id),
      },
      data: {
        dateTime,
        firstName: firstName || appointment.firstName,
        lastName: lastName !== undefined ? lastName : appointment.lastName,
        clientEmail: clientEmail || appointment.clientEmail,
        status,
        userId: status === "booked" ? user.id : appointment.userId,
      },
    });

    const date = new Date(appointment.dateTime).toLocaleDateString();
    const time = new Date(appointment.dateTime).toLocaleTimeString();
    await sendEmail(
      clientEmail!,
      "Appointment Confirmation",
      `Your appointment for ${date} at ${time} has been confirmed. View your appointments <a href="https://chechocutzz.com/my-appointments">here</a>.`
    );
    await sendAdminNotification(
      "New Appointment Booked",
      `A new appointment has been booked:
      <br>Name: ${firstName} ${lastName}
      <br>Email: ${clientEmail}
      <br>Date: ${date}
      <br>Time: ${time}
      <br><a href="https://chechocutzz.com/admin">View in Admin Dashboard</a>`
    );

    return NextResponse.json(
      { appointment: updatedAppointment },
      { status: 200 }
    );
  } catch (error: any) {
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
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Please sign in" }, { status: 401 });
    }

    const user = session.user;
    if (user.user_metadata.user_metadata.role !== "admin") {
      return NextResponse.json({ error: "Must be an admin" }, { status: 401 });
    }

    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const appointmentId = parseInt(id, 10);
    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointment ID format" },
        { status: 400 }
      );
    }

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

    await prisma.appointment.delete({
      where: {
        id: appointmentId,
      },
    });

    return NextResponse.json(
      { message: "Appointment deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error deleting appointment", details: error.message },
      { status: 500 }
    );
  }
}
