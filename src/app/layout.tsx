"use client";
import React from "react";
import "./globals.css";
import ClientRedirect from "./ClientRedirect";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          // height: "100000px",
          // background: "linear-gradient(135deg,rgb(115, 156, 184) 0%,rgb(91, 132, 173) 100%);",
          background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);",
        }}
      >
        <SessionProvider>
          <ClientRedirect />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
