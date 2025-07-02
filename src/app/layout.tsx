"use client";
import React from "react";
import "./globals.css";
import ClientRedirect from "./ClientRedirect";
import { SessionProvider, useSession } from "next-auth/react";
import CodeLoader from "./[lang]/components/loading/CodeLoader";

function SessionGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  if (status === "loading") {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CodeLoader />
      </div>
    );
  }
  return <>{children}</>;
}

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
          <SessionGate>{children}</SessionGate>
        </SessionProvider>
      </body>
    </html>
  );
}
