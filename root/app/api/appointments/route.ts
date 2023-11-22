import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";
import prisma from "@/prisma/client";
import nodemailer from "nodemailer";
import EmailConfirmation from "@/components/EmailConfirmation";
import EmailDeletion from "@/components/EmailDeletion";
import AdminConfirmEmail from "@/components/AdminConfirmEmail";
import AdminDeleteEmail from "@/components/AdminDeleteEmail";

export async function GET(req: NextRequest) {
  try {
    const { getAccessToken } = getKindeServerSession();
    const accessToken: any = await getAccessToken();
    if (accessToken?.permissions != "admin") {
      return NextResponse.json({ statusText: "Forbidden", statusCode: 403 });
    }

    const { searchParams } = new URL(req.nextUrl);
    const userId = searchParams.get("userId");

    let query = {};
    if (userId) query = { where: { userId } };
    const appointments = await prisma.appointment.findMany({
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

    return NextResponse.json({
      appointments,
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
    if (accessToken?.permissions != "admin") {
      return NextResponse.json({ statusText: "Forbidden", statusCode: 403 });
    }
    const body: any = await req.json();
    const { dateTime, firstName, lastName, clientEmail, userId, status } = body;

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        dateTime: new Date(dateTime),
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

    const newAppointment = await prisma.appointment.create({
      data: {
        dateTime: new Date(dateTime),
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
    return NextResponse.json({ statusText: e.message, statusCode: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { getAccessToken } = getKindeServerSession();
  const accessToken: any = await getAccessToken();
  // if (accessToken?.permissions != "admin") {
  //   return NextResponse.json({ statusText: "Forbidden", statusCode: 403 });
  // }

  const body: any = await req.json();
  const { id, dateTime, firstName, lastName, clientEmail, userId, status } =
    body;

  if (!id)
    return NextResponse.json({ statusText: "Missing id", statusCode: 400 });
  const updatedAppointment = await prisma.appointment.update({
    where: { id },
    data: {
      dateTime: new Date(dateTime),
      firstName,
      lastName,
      clientEmail,
      userId,
      status,
    },
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
  });

  const clientEmailContent = render(EmailConfirmation(firstName, dateTime));
  const clientMailOptions = {
    from: process.env.ZOHO_EMAIL,
    to: clientEmail,
    subject: "Appointment Confirmation",
    html: clientEmailContent,
  };

  const adminEmailContent = render(
    AdminConfirmEmail(firstName, dateTime, clientEmail)
  );
  const adminMailOptions = {
    from: process.env.ZOHO_EMAIL,
    to: clientEmail,
    subject: "Appointment Confirmation",
    html: adminEmailContent,
  };

  if (!dateTime) {
    throw new Error("Missing dateTime");
  }

  // transporter.sendMail(clientMailOptions, (error, info) => {
  //   if (error) {
  //     console.log("Email Error: ", error);
  //   }
  //   console.log("Email sent: ", info.response);
  // });

  // transporter.sendMail(adminMailOptions, (error, info) => {
  //   if (error) {
  //     console.log("Email Error: ", error);
  //   }
  //   console.log("Email sent: ", info.response);
  // });

  return NextResponse.json({
    updatedAppointment,
    statusText: "Created",
    statusCode: 201,
  });
}

export async function DELETE(req: NextRequest) {
  const { getAccessToken } = getKindeServerSession();
  const accessToken: any = await getAccessToken();

  if (!accessToken || accessToken?.permissions !== "admin") {
    return NextResponse.json({ statusText: "Forbidden", statusCode: 403 });
  }

  const body: any = await req.json();
  const { id, dateTime, clientEmail, firstName } = body;

  if (!id)
    return NextResponse.json({ statusText: "Missing id", statusCode: 400 });

  const appointmentToDelete = await prisma.appointment.findUnique({
    where: { id },
  });

  if (!appointmentToDelete) {
    return NextResponse.json({
      statusText: "Appointment not found",
      statusCode: 404,
    });
  }

  if (clientEmail && firstName) {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    const clientEmailContent = render(EmailDeletion(firstName, dateTime));
    const clientMailOptions = {
      from: process.env.ZOHO_EMAIL,
      to: clientEmail,
      subject: "Deleted Email",
      html: clientEmailContent,
    };

    const adminEmailContent = render(
      AdminDeleteEmail(firstName, dateTime, clientEmail)
    );
    const adminMailOptions = {
      from: process.env.ZOHO_EMAIL,
      to: clientEmail,
      subject: "Deleted Email",
      html: adminEmailContent,
    };

    // transporter.sendMail(clientMailOptions, (error, info) => {
    //   if (error) {
    //     console.log("Email Error: ", error);
    //   }
    //   console.log("Email sent: ", info.response);
    // });

    // transporter.sendMail(adminMailOptions, (error, info) => {
    //   if (error) {
    //     console.log("Email Error: ", error);
    //   }
    //   console.log("Email sent: ", info.response);
    // });
  }

  await prisma.appointment.delete({ where: { id } });

  return NextResponse.json({ statusText: "Deleted", statusCode: 200 });
}
