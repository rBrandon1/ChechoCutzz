import "/app/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking",
  description: "Booking page",
};

export default async function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
