import { sendAdminNotification, sendEmail } from "@/lib/email";
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

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

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
    const isAdminCancellation = user.role === "admin";
    // const emailSubject = isAdminCancellation
    //   ? "Appointment Cancelled by Admin"
    //   : "Appointment Cancellation Confirmation";
    // const emailContent = isAdminCancellation
    //   ? `Your appointment for ${date} at ${time} has been cancelled by the admin. If you have any questions, please message <a href="https://www.instagram.com/checho.cutzz/">ChechoCutzz</a>.`
    //   : `Your appointment for ${date} at ${time} has been cancelled as requested.`;

    // await sendEmail(appointment.clientEmail, emailSubject, emailContent);
    // await sendAdminNotification(
    //   "Appointment Cancelled",
    //   `An appointment has been cancelled:
    //   <br>Name: ${appointment.firstName} ${appointment.lastName}
    //   <br>Email: ${appointment.clientEmail}
    //   <br>Date: ${date}
    //   <br>Time: ${time}
    //   <br>Cancelled by: ${isAdminCancellation ? "Admin" : "User"}
    //   <br><a href="https://chechocutzz.com/admin">View in Admin Dashboard</a>`
    // );

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
