'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Dukaan Dashboard by Manudev.</title>
      </head>
      <body className={twMerge("bg-background flex relative", inter.className)}>
          <Sidebar />
          <div className="w-full">
            <Header/>
            {children}
          </div>
      </body>
    </html>
  );
}
