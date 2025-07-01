"use client";
import { useEffect, useState } from "react";
import CodeLoader from "./[lang]/components/loading/CodeLoader";

export default function HomePage() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Optionally, you can add a timeout or logic here if needed
    setShowLoader(true);
  }, []);

  if (!showLoader) return null;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CodeLoader />
    </div>
  );
}
