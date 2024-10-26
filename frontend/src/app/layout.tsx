// src/app/layout.tsx

'use client'; // This makes the component a Client Component

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Ensure this component is also a client component if it uses hooks
import { ThemeProvider } from './context/context'; // Make sure this is a client component if it uses hooks
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
      
    </html>
  );
}
