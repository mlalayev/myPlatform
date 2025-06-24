import React from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body  style={{
        height: "100000px"
      }}>
        {children}
      </body>
    </html>
  );
}
