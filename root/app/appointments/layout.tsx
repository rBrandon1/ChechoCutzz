import "/app/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appointments",
  description: "Appointments page",
};

export default async function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
