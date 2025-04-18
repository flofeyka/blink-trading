import Header from "@/components/shared/Header/Header";
import type {Metadata} from "next";
import {Geist, Montserrat} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Montserrat({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blink",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-medium ${geistMono.variable}`}>
        <div className="min-h-screen pb-10 h-full w-full bg-[#181818] text-white font-medium">
          <header>
            <Header />
          </header>
          <main className="px-5 max-md:mt-5 mt-10 max-md:px-2">{children}</main>
        </div>
      </body>
    </html>
  );
}
