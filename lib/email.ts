import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail =
  process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email)
    .pop() || "";

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const data = await resend.emails.send({
      from: "ChechoCutzz <noreply@chechocutzz.com>",
      to,
      subject,
      html,
    });
  } catch (error: any) {
    throw new Error(`Error sending email: ${error.message}`);
  }
}

export async function sendAdminNotification(subject: string, html: string) {
  if (!adminEmail) {
    return;
  }
  await sendEmail(adminEmail, subject, html);
}
