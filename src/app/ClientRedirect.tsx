"use client";
import { useEffect, useState } from "react";

export default function ClientRedirect() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (window.location.pathname === "/") {
      setShowLoader(true);
      let lang = localStorage.getItem("selectedLanguage");
      if (!lang) {
        lang = "az";
        localStorage.setItem("selectedLanguage", lang);
      }
      setTimeout(() => {
        if (window.location.pathname !== `/${lang}`) {
          window.location.replace(`/${lang}`);
        }
      }, 600); // Show loader for at least 600ms
    }
  }, []);

  if (!showLoader) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        width: 60,
        height: 60,
        border: '6px solid #e2e8f0',
        borderTop: '6px solid #6c3fc5',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 