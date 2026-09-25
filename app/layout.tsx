import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bangladeshi FM Radio - লাইভ বাংলাদেশ বেতার ও এফএম",
  description:
    "Listen to all verified Bangladeshi FM radio stations live online: Radio Foorti, Radio Today, Dhaka FM, Jago FM, Spice FM, Bangladesh Betar and more.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Radio BD",
  },
};

export const viewport: Viewport = {
  themeColor: "#2a1789",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#1c114f] text-slate-100 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
