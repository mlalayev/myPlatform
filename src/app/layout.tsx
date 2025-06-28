import React from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body  style={{
        // height: "100000px",
        background: "rgb(245, 245, 245)"
      }}>
        {children}
      </body>
    </html>
  );
}
