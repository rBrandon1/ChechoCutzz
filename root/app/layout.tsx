import "./globals.css";
import { Playfair_Display } from "next/font/google";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import Head from "next/head";

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
      "Website for booking haircuts with Sergio, a barber in Canby, OR.",
    images: ["/opengraph-image.png"],
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
      <Head>
        <title>ChechoCutzz</title>
        <meta
          name="Website for booking haircuts with Sergio, a barber in Canby, OR."
          content="Landing page for ChechoCutzz"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://chechocutzz.com" />
        <meta property="og:title" content="ChechoCutzz" />
        <meta
          property="og:description"
          content="Book your next haircut with Sergio, a barber in Canby, OR."
        />
        <meta
          property="og:image"
          content="https://chechocutzz.com/opengraph-image.png"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://chechocutzz.com/opengraph-image.png"
        />
        <meta property="twitter:title" content="ChechoCutzz" />
        <meta
          property="twitter:description"
          content="Book your next haircut with Sergio, a barber in Canby, OR."
        />
        <meta
          property="twitter:image"
          content="https://chechocutzz.com/opengraph-image.png"
        />
      </Head>
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
                Admin Dashboard
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
