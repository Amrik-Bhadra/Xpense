import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "./components/sidebar";
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
  title: "Xpense",
  description: "Track your spending, effortlessly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 min-w-0 h-screen overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}