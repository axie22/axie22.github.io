import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundBlobs } from "@/components/layout/BackgroundBlobs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alexander Xie | Software Engineer",
  description:
    "Portfolio of Alexander Xie, a Software Engineer specializing in scalable systems and ML infrastructure.",
  metadataBase: new URL("https://axie22.github.io"),
  openGraph: {
    title: "Alexander Xie | Software Engineer",
    description:
      "Portfolio of Alexander Xie, a Software Engineer specializing in scalable systems and ML infrastructure.",
    url: "https://axie22.github.io",
    siteName: "Alexander Xie",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexander Xie | Software Engineer",
    description:
      "Portfolio of Alexander Xie, a Software Engineer specializing in scalable systems and ML infrastructure.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <BackgroundBlobs />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
