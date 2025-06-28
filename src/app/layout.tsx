import React from "react";
import "./globals.css";

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
          background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);",
        }}
      >
        {children}
      </body>
    </html>
  );
}
