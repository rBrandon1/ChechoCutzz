import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";
import prisma from "@/prisma/client";
import nodemailer from "nodemailer";
import EmailTemplate from "@/components/EmailTemplate";

export async function GET() {
  try {
    const { getAccessToken } = getKindeServerSession();
    const accessToken: any = await getAccessToken();
    // if (accessToken?.permissions != "admin") {
    //   return NextResponse.json({ statusText: "Forbidden", statusCode: 403 });
    // }
    const appointments = await prisma.appointment.findMany({
      select: {
        id: true,
        dateTime: true,
        clientName: true,
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
    // if (accessToken?.permissions != "admin") {
    //   return NextResponse.json({ statusText: "Forbidden", statusCode: 403 });
    // }
    const body: any = await req.json();
    const { dateTime, clientName, clientEmail, userId, status } = body;
    const newAppointment = await prisma.appointment.create({
      data: {
        dateTime: new Date(dateTime),
        clientName,
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
  const { id, dateTime, clientName, clientEmail, userId, status } = body;

  if (!id)
    return NextResponse.json({ statusText: "Missing id", statusCode: 400 });
  const updatedAppointment = await prisma.appointment.update({
    where: { id },
    data: {
      dateTime: new Date(dateTime),
      clientName,
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

  const emailContent = render(EmailTemplate(clientName, dateTime));

  const mailOptions = {
    from: process.env.ZOHO_EMAIL,
    to: clientEmail,
    subject: "Appointment Confirmation",
    html: emailContent,
  };

  if (!dateTime) {
    console.log("date missing");
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Email Error: ", error);
    }
    console.log("Email sent: ", info.response);
  });

  return NextResponse.json({
    updatedAppointment,
    statusText: "Created",
    statusCode: 201,
  });
}
