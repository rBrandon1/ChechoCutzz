import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";
import prisma from "@/prisma/client";
import nodemailer from "nodemailer";
import EmailConfirmation from "@/components/EmailConfirmation";
import EmailDeletion from "@/components/EmailDeletion";
import AdminConfirmEmail from "@/components/AdminConfirmEmail";
import AdminDeleteEmail from "@/components/AdminDeleteEmail";
import { DateTime } from "luxon";
import EmailCancellation from "@/components/EmailCancellation";
import AdminCancelEmail from "@/components/AdminCancelEmail";

export async function GET(req: NextRequest) {
  try {
    const { getAccessToken } = getKindeServerSession();
    const accessToken: any = await getAccessToken();
    let appointments;

    if (!accessToken?.permissions?.includes("admin")) {
      appointments = await prisma.appointment.findMany({
        where: {
          userId: accessToken?.sub,
          status: "booked",
        },
        select: {
          id: true,
          dateTime: true,
          status: true,
        },
      });
    }
    const { searchParams } = new URL(req.nextUrl);
    const userId = searchParams.get("userId");
    let query = userId && { where: { userId } };
    appointments = await prisma.appointment.findMany({
      ...query,
      select: {
        id: true,
        dateTime: true,
        firstName: true,
        lastName: true,
        clientEmail: true,
        userId: true,
        user: true,
        status: true,
      },
    });

    const convertedAppointments = appointments?.map((appointment) => ({
      ...appointment,
      dateTime: DateTime.fromJSDate(appointment?.dateTime).toUTC().toISO(),
    }));

    return NextResponse.json({
      convertedAppointments,
      statusText: "OK",
      statusCode: 200,
    });
  } catch (e: any) {
    return NextResponse.json({
      statusText: e.message,
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { getAccessToken } = getKindeServerSession();
    const accessToken: any = await getAccessToken();
    if (!accessToken?.permissions?.includes("admin")) {
      return NextResponse.json({ statusText: "Forbidden", statusCode: 403 });
    }

    const body: any = await req.json();
    const { id, dateTime, firstName, lastName, clientEmail, userId, status } =
      body;
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return NextResponse.json({
        statusText: "User not found",
        statusCode: 404,
      });
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        dateTime: DateTime.fromISO(dateTime, {
          zone: "America/Los_Angeles",
        }).toJSDate(),
        userId,
        status: { in: ["available", "booked"] },
      },
    });

    if (existingAppointment) {
      return NextResponse.json({
        statusText: "Duplicate appointment exists.",
        statusCode: 409,
      });
    }

    const utcDateTime = DateTime.fromISO(dateTime).toUTC();
    if (utcDateTime < DateTime.now().setZone("America/Los_Angeles")) {
      return NextResponse.json({
        statusText: "Appointment date is in the past.",
        statusCode: 400,
      });
    }
    const newAppointment = await prisma.appointment.create({
      data: {
        id,
        dateTime: utcDateTime.toJSDate(),
        firstName,
        lastName,
        clientEmail,
        userId,
        status,
      },
    });
    return NextResponse.json({
      newAppointment,
      statusText: "Created",
      statusCode: 201,
    });
  } catch (e: any) {
    return NextResponse.json({ statusText: e?.message, statusCode: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: any = await req.json();
    const {
      id,
      dateTime,
      firstName,
      lastName,
      clientEmail,
      userId,
      status,
      newFirstName,
    } = body;

    const utcDateTime = DateTime.fromISO(dateTime, {
      zone: "America/Los_Angeles",
    }).toUTC();

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        dateTime: utcDateTime.toJSDate(),
        firstName,
        lastName,
        clientEmail,
        userId,
        status,
      },
    });

    if (newFirstName) {
      await prisma.appointment.update({
        where: { id },
        data: {
          firstName: newFirstName,
          lastName: "",
          dateTime,
          clientEmail,
          userId,
          status,
        },
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    const clientEmailContent = render(EmailConfirmation(firstName, dateTime));
    const adminEmailContent = render(
      AdminConfirmEmail(firstName, dateTime, clientEmail)
    );

    const clientMailOptions = {
      from: process.env.ZOHO_EMAIL,
      to: clientEmail,
      subject: "Appointment Confirmation",
      html: clientEmailContent,
    };
    const adminMailOptions = {
      from: process.env.ZOHO_EMAIL,
      to: process.env.SERGIO_EMAIL,
      subject: "Appointment Confirmation",
      html: adminEmailContent,
    };

    if (!dateTime) {
      throw new Error("Missing dateTime.");
    }

    await Promise.all([
      transporter.sendMail(clientMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    if (!id) {
      return NextResponse.json({ statusText: "Missing id", statusCode: 400 });
    }

    return NextResponse.json({
      updatedAppointment,
      statusText: "Appointment updated",
      statusCode: 200,
    });
  } catch (e: any) {
    return NextResponse.json({ statusText: e, statusCode: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { getAccessToken } = getKindeServerSession();
  const accessToken: any = await getAccessToken();

  try {
    const body: any = await req.json();
    const {
      id,
      dateTime,
      clientEmail,
      firstName,
      lastName,
      status,
      initiatedByUser,
    } = body;
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    if (!id) {
      return NextResponse.json({ statusText: "Missing id", statusCode: 400 });
    }

    if (initiatedByUser && !accessToken?.permissions?.includes("admin")) {
      const appointmentToUpdate = await prisma.appointment.findUnique({
        where: { id },
      });

      if (!appointmentToUpdate) {
        return NextResponse.json({
          statusText: "Appointment not found",
          statusCode: 404,
        });
      }

      const clientEmailContent = render(EmailCancellation(firstName, dateTime));
      const adminEmailContent = render(
        AdminCancelEmail(firstName, lastName, dateTime, clientEmail)
      );
      const clientMailOptions = {
        from: process.env.ZOHO_EMAIL,
        to: clientEmail,
        subject: "Appointment Cancellation",
        html: clientEmailContent,
      };
      const adminMailOptions = {
        from: process.env.ZOHO_EMAIL,
        to: process.env.SERGIO_EMAIL,
        subject: "Appointment Cancellation",
        html: adminEmailContent,
      };

      await Promise.all([
        transporter.sendMail(clientMailOptions),
        transporter.sendMail(adminMailOptions),
      ]);

      await prisma.appointment.update({
        where: { id },
        data: {
          userId: null,
          firstName: "",
          lastName: "",
          clientEmail: "",
          status: "available",
        },
      });

      return NextResponse.json({
        statusText: "Appointment cancelled",
        statusCode: 200,
      });
    }

    if (!accessToken?.permissions?.includes("admin")) {
      return NextResponse.json({ statusText: "Forbidden", statusCode: 403 });
    }

    const appointmentToDelete = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointmentToDelete) {
      return NextResponse.json({
        statusText: "Appointment not found",
        statusCode: 404,
      });
    }

    if (status === "available") {
      await prisma.appointment.delete({ where: { id } });
      return NextResponse.json({ statusText: "Deleted", statusCode: 200 });
    }

    const clientEmailContent = render(EmailDeletion(firstName, dateTime));
    const adminEmailContent = render(
      AdminDeleteEmail(firstName, dateTime, clientEmail)
    );

    const clientMailOptions = {
      from: process.env.ZOHO_EMAIL,
      to: clientEmail,
      subject: "Appointment Deleted",
      html: clientEmailContent,
    };
    const adminMailOptions = {
      from: process.env.ZOHO_EMAIL,
      to: process.env.SERGIO_EMAIL,
      subject: "Appoinment Deleted",
      html: adminEmailContent,
    };

    await Promise.all([
      transporter.sendMail(clientMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);
    await prisma.appointment.delete({ where: { id } });

    return NextResponse.json({ statusText: "Deleted", statusCode: 200 });
  } catch (e: any) {
    return NextResponse.json({
      statusText: e,
      statusCode: 500,
    });
  }
}
