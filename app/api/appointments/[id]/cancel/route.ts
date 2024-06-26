import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import createServerSupabaseClient from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  const userId = session.user.id;
  const appointmentId = parseInt(params.id);

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    if (appointment.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to cancel this appointment" },
        { status: 403 }
      );
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        userId: null,
        status: "available",
        firstName: "",
        lastName: "",
        clientEmail: "",
      },
    });

    const date = new Date(appointment.dateTime).toLocaleDateString();
    const time = new Date(appointment.dateTime).toLocaleTimeString();
    const isAdminCancellation = session.user.user_metadata.role === "admin";
    const emailSubject = isAdminCancellation
      ? "Appointment Cancelled by Admin"
      : "Appointment Cancellation Confirmation";
    const emailContent = isAdminCancellation
      ? `Your appointment for ${date} at ${time} has been cancelled by the admin. If you have any questions, please contact us.`
      : `Your appointment for ${date} at ${time} has been cancelled as requested.`;

    await sendEmail(appointment.clientEmail, emailSubject, emailContent);

    return NextResponse.json(
      { appointment: updatedAppointment },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error cancelling appointment" },
      { status: 500 }
    );
  }
}
