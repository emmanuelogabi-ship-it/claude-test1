import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import WipeOverlay from "@/components/WipeOverlay";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Reverb — Discovery Industry Solutions",
  description: "Award-winning portfolio of industrial innovation",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <WipeOverlay />
        {children}
      </body>
    </html>
  );
}
