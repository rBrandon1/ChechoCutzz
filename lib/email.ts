import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
