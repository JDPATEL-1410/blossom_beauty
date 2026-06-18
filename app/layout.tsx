import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blossom Beauty Room | Premium Beauty Salon in Douglasville, GA",
  description:
    "Experience luxury beauty services at Blossom Beauty Room in Douglasville, GA. Specializing in lash enhancements, facials, waxing, threading & more. Book your appointment today!",
  keywords:
    "beauty salon, lash extensions, facials, waxing, threading, Douglasville GA, Blossom Beauty Room",
  openGraph: {
    title: "Blossom Beauty Room | Premium Beauty Salon in Douglasville, GA",
    description:
      "Experience luxury beauty services at Blossom Beauty Room. Specializing in lash enhancements, facials, waxing, threading & more.",
    type: "website",
  },
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${greatVibes.variable} ${cormorantGaramond.variable} ${montserrat.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
