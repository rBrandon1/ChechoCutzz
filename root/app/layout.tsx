import "./globals.css";
import { Playfair_Display } from "next/font/google";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import Head from "next/head";
import { ScissorsIcon } from "@radix-ui/react-icons";

export const metadata: Metadata = {
  title: "ChechoCutzz",
  description:
    "Website for booking haircuts with Sergio, a barber in Canby, OR.",
};
export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={playfair.className}>
      <body className="flex flex-col min-h-screen bg-background">
        <link rel="icon" type="image/icon" href="/barber.png" />

        <NavBar />
        <div className="mx-6 mt-6 tracking-wider text-[16px]">
          <main className="flex-grow">{children}</main>
          <Toaster />
        </div>
        <footer className="border-t my-8 p-4 w-full text-center">
          <div className="grid grid-flow-col divide-x mx-auto items-center">
            <div>
              <Link
                href="https://brandnramirez.com"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 text-muted-foreground hover:text-accent"
              >
                © Brandon Ramirez {new Date().getFullYear()}
              </Link>
            </div>
            <div>
              <Link
                href="/admin"
                target="_blank"
                rel="noreferrer"
                className="text-accent-foreground hover:text-accent"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
