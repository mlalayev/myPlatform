"use client";
import React, { useEffect, useState } from "react";
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

function LoginPointPopup() {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !(session?.user && (session.user as any).id)) return;
    const userId = (session.user as any).id;
    const lastPopupKey = `loginPointPopup_${userId}`;
    const lastShown = localStorage.getItem(lastPopupKey);
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    if (lastShown === todayStr) {
      setChecked(true);
      return;
    }
    // Fetch user profile to check if login point was received today
    fetch(`/api/admin/users/${userId}`)
      .then(res => res.json())
      .then(user => {
        if (!user || !user.lastLoginDate) return setChecked(true);
        const lastLogin = new Date(user.lastLoginDate);
        if (
          today.getFullYear() === lastLogin.getFullYear() &&
          today.getMonth() === lastLogin.getMonth() &&
          today.getDate() === lastLogin.getDate()
        ) {
          setShow(true);
          localStorage.setItem(lastPopupKey, todayStr);
        }
        setChecked(true);
      });
  }, [session, status]);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShow(false), 400); // match fade duration
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show || !checked) return null;
  return (
    <>
      <div className={`login-point-popup${fadeOut ? " fade-out" : ""}`}>
        <span className="coin-spin">
          {/* SVG Coin Icon */}
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="coinGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff7c1"/>
                <stop offset="100%" stopColor="#ffd700"/>
              </radialGradient>
            </defs>
            <circle cx="19" cy="19" r="18" fill="url(#coinGradient)" stroke="#e6c200" strokeWidth="2"/>
            <text x="50%" y="54%" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#e6c200" fontFamily="Helvetica Neue, Arial, sans-serif">₵</text>
          </svg>
        </span>
        <span className="login-point-text">
          <b>+1</b> point for daily login
        </span>
      </div>
      <style>{`
        .login-point-popup {
          position: fixed;
          top: 36px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          color: #222;
          border-radius: 18px;
          box-shadow: 0 4px 32px rgba(108,63,197,0.10), 0 1.5px 8px rgba(0,0,0,0.08);
          padding: 18px 38px 18px 28px;
          z-index: 9999;
          font-weight: 600;
          font-size: 1.18em;
          display: flex;
          align-items: center;
          gap: 18px;
          border: 2px solid #e6c200;
          animation: fadeInScale 0.4s cubic-bezier(.4,1.4,.6,1);
          transition: opacity 0.4s;
        }
        .login-point-popup.fade-out {
          opacity: 0;
        }
        .coin-spin {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 2px;
          perspective: 400px;
        }
        .coin-spin svg {
          width: 38px;
          height: 38px;
          animation: coin3dspin 1.1s linear infinite;
        }
        @keyframes coin3dspin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes fadeInScale {
          0% { opacity: 0; transform: translateX(-50%) scale(0.85); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
      `}</style>
    </>
  );
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
          minHeight: "100vh",
          // background: "linear-gradient(135deg,rgb(115, 156, 184) 0%,rgb(91, 132, 173) 100%);",
          background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);",
        }}
      >
        <SessionProvider>
          <LoginPointPopup />
          <ClientRedirect />
          <SessionGate>{children}</SessionGate>
        </SessionProvider>
      </body>
    </html>
  );
}
