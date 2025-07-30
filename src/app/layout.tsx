"use client";
import React, { useState, useEffect, useCallback } from "react";
import "./globals.css";
import ClientRedirect from "./ClientRedirect";
import { SessionProvider, useSession } from "next-auth/react";
import CodeLoader from "./[lang]/components/loading/CodeLoader";
import { AchievementProvider } from "../contexts/AchievementContext";

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
  const { data: session, status, update } = useSession();
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Function to check and show popup
  const checkAndShowPopup = useCallback(async () => {
    if (
      status !== "authenticated" ||
      !(session?.user && (session.user as unknown as { id: string }).id)
    )
      return;
    
    const userId = (session.user as unknown as { id: string }).id;
    const isNewUser = (session.user as unknown as { isNewUser: boolean }).isNewUser;
    const lastPopupKey = `loginPointPopup_${userId}`;
    const lastShown = localStorage.getItem(lastPopupKey);
    
    // Get current time in Azerbaijan (UTC+4)
    const now = new Date();
    const azerbaijanTime = new Date(now.getTime() + (4 * 60 * 60 * 1000)); // UTC+4
    const todayStr = `${azerbaijanTime.getFullYear()}-${azerbaijanTime.getMonth()}-${azerbaijanTime.getDate()}`;
    const currentHour = azerbaijanTime.getHours();
    
    console.log('Checking popup conditions:', {
      userId: userId,
      isNewUser: isNewUser,
      lastShown: lastShown,
      todayStr: todayStr,
      currentHour: currentHour,
      isAfterMidnight: currentHour >= 0,
      pathname: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
    });
    
    // For new users, show popup and clear the isNewUser flag
    if (isNewUser && lastShown !== todayStr) {
      console.log('Showing popup for new user');
      setShow(true);
      localStorage.setItem(lastPopupKey, todayStr);
      setChecked(true);
      
      // Clear the isNewUser flag from session to prevent showing on reload
      update({ isNewUser: false });
      return;
    }
    
    // If we already showed the popup today, don't show it again
    if (lastShown === todayStr) {
      console.log('Popup already shown today, skipping');
      setChecked(true);
      return;
    }
    
    // Check if it's after 12:00 AM (midnight) Azerbaijan time
    const isAfterMidnight = currentHour >= 0; // After midnight (12:00 AM)
    
    // Show popup on any page if it's after 12:00 AM
    if (isAfterMidnight) {
      console.log('After 12:00 AM detected, checking user login status');
      // Fetch user profile to check if user logged in today
      try {
        const res = await fetch(`/api/user/profile`);
        if (!res.ok) {
          console.warn('User data API not available:', res.status);
          setChecked(true);
          return;
        }
        
        const userData = await res.json();
        if (!userData || !userData.user) {
          console.warn('No user data available');
          setChecked(true);
          return;
        }
        
        const lastLogin = userData.user.lastActive ? new Date(userData.user.lastActive) : null;
        
        // Convert both dates to Azerbaijan time for comparison
        const now = new Date();
        const azerbaijanTime = new Date(now.getTime() + (4 * 60 * 60 * 1000)); // UTC+4
        const today = new Date(azerbaijanTime.getFullYear(), azerbaijanTime.getMonth(), azerbaijanTime.getDate());
        
        // Convert lastLogin to Azerbaijan time
        const lastLoginAzerbaijan = lastLogin ? new Date(lastLogin.getTime() + (4 * 60 * 60 * 1000)) : null;
        const lastLoginDate = lastLoginAzerbaijan ? new Date(lastLoginAzerbaijan.getFullYear(), lastLoginAzerbaijan.getMonth(), lastLoginAzerbaijan.getDate()) : null;
        
        console.log('User login check:', {
          lastLogin: lastLogin,
          lastLoginAzerbaijan: lastLoginAzerbaijan,
          lastLoginDate: lastLoginDate,
          today: today,
          lastLoginDateStr: lastLoginDate ? `${lastLoginDate.getFullYear()}-${lastLoginDate.getMonth()}-${lastLoginDate.getDate()}` : 'null',
          todayDateStr: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
        });
        
        // Show popup if it's after 12:00 AM Azerbaijan time (regardless of login date)
        // The popup should show every day when user visits profile page after midnight
        console.log('Showing login point popup - it\'s after 12:00 AM Azerbaijan time');
          setShow(true);
          localStorage.setItem(lastPopupKey, todayStr);
        setChecked(true);
      } catch (error) {
        console.warn('User data fetch failed:', error);
        setChecked(true);
      }
    } else {
      console.log('Not showing popup - before 12:00 AM:', {
        isAfterMidnight: isAfterMidnight,
        currentHour: currentHour
      });
      setChecked(true);
    }
  }, [session, status, update]);

  useEffect(() => {
    // Skip popup for exercises pages to avoid API calls
    if (typeof window !== 'undefined' && window.location.pathname.includes('/exercises/')) {
      setChecked(true);
      return;
    }
    
    // Only check popup on initial load, not on every session change
    if (!checked) {
      checkAndShowPopup();
    }
  }, [checkAndShowPopup, checked]);

  // Removed profile page event listener since popup now works on all pages

  useEffect(() => {
    if (show) {
      // Add coin when popup shows
      const addCoin = async () => {
        try {
          const response = await fetch('/api/user/activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'DAILY_LOGIN_BONUS',
              description: 'Daily login bonus +1 point',
              metadata: { points: 1 }
            })
          });
          
          if (response.ok) {
            console.log('Daily login bonus added successfully');
          } else {
            console.warn('Failed to add daily login bonus');
          }
        } catch (error) {
          console.error('Error adding daily login bonus:', error);
        }
      };
      
      addCoin();
      
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShow(false), 400); // match fade duration
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show || !checked) return null;
  
  console.log('Rendering login point popup');
  
  return (
    <>
      <div className={`login-point-popup${fadeOut ? " fade-out" : ""}`}>
        <span className="coin-spin">
          {/* SVG Coin Icon */}
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="coinGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff7c1" />
                <stop offset="100%" stopColor="#ffd700" />
              </radialGradient>
            </defs>
            <circle
              cx="19"
              cy="19"
              r="18"
              fill="url(#coinGradient)"
              stroke="#e6c200"
              strokeWidth="2"
            />
            <text
              x="50%"
              y="54%"
              textAnchor="middle"
              fontSize="18"
              fontWeight="bold"
              fill="#e6c200"
              fontFamily="Helvetica Neue, Arial, sans-serif"
            >
              ₵
            </text>
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
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <SessionProvider>
          <AchievementProvider>
            <LoginPointPopup />
            <ClientRedirect />
            <SessionGate>{children}</SessionGate>
          </AchievementProvider>
        </SessionProvider>
      </body>
    </html>
  );
}


