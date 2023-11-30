import "./globals.css";
import { Playfair_Display } from "next/font/google";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import { DateTime } from "luxon";

export const metadata: Metadata = {
  title: "ChechoCutzz",
  description:
    "Website for booking haircuts with Sergio, a barber in Canby, OR.",
  icons: ["/barber.png"],
  appleWebApp: {
    title: "ChechoCutzz",
    startupImage: "/barber.png",
  },
  creator: "Brandon Ramirez",
  keywords: ["barber", "haircut", "oregon", "salon"],
  applicationName: "ChechoCutzz",
  openGraph: {
    title: "ChechoCutzz",
    url: "https://chechocutzz.com",
    description:
      "Book your next today with Sergio, using the ChechoCutzz website",
    images: ["https://chechocutzz.com/opengraph-image.png"],
    type: "website",
  },
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
        <NavBar />
        <div className="mx-6 mt-6 tracking-wider text-[18px]">
          <main className="flex-grow">{children}</main>
          <Toaster />
        </div>
        <footer className="border-t my-6 p-4 w-full text-center">
          <div className="grid grid-flow-col divide-x mx-auto items-center">
            <div>
              <Link
                href="https://brandnramirez.com"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-[3px] text-muted-foreground hover:text-accent"
              >
                © Brandon Ramirez {DateTime.now().year}
              </Link>
            </div>
            <div>
              <Link
                href="/admin"
                target="_blank"
                rel="noreferrer"
                className="text-accent-foreground hover:text-accent"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
