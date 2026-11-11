import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SUBLINE } from "@/lib/forward-pass/config";
import { Navbar } from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description = SUBLINE;

export const metadata: Metadata = {
  title: "Alexander Xie | Software Engineer",
  description:
    description,
  metadataBase: new URL("https://axie22.github.io"),
  openGraph: {
    title: "Alexander Xie | Software Engineer",
    description:
      description,
    url: "https://axie22.github.io",
    siteName: "Alexander Xie",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexander Xie | Software Engineer",
    description:
      description,
  },
  verification: {
    google: "fQzxQkZJzGy2y9TAchYQMZrlaGC9nbFGyXAWutO01B4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
