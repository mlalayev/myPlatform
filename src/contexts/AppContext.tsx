"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  logActivity: (type: string, description: string, metadata?: any) => Promise<void>;
  sessionId: number | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const { data: session, status } = useSession();

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (isClient) {
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode !== null) {
        setIsDarkMode(JSON.parse(savedDarkMode));
      }
    }
  }, [isClient]);

  // Apply dark mode to document
  useEffect(() => {
    if (isClient) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }
  }, [isDarkMode, isClient]);

  // Session tracking functionality - TEMPORARILY DISABLED
  /* 
  useEffect(() => {
    if (!isClient || status !== 'authenticated' || !session) return;

    // Start session when user is authenticated
    const startSession = async () => {
      try {
        const response = await fetch('/api/user/session', {
          method: 'POST',
        });
        if (response.ok) {
          const data = await response.json();
          setSessionId(data.sessionId);
          
          // Log login activity
          await logActivityInternal('LOGIN', 'User logged in');
        }
      } catch (error) {
        console.error('Error starting session:', error);
      }
    };

    // End session when page is unloaded
    const endSession = async () => {
      if (sessionId) {
        try {
          await fetch('/api/user/session', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });
          
          // Log logout activity
          await logActivityInternal('LOGOUT', 'User logged out');
        } catch (error) {
          console.error('Error ending session:', error);
        }
      }
    };

    startSession();

    // Add event listeners for page unload
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliability
      if (sessionId) {
        navigator.sendBeacon('/api/user/session', JSON.stringify({
          sessionId,
          method: 'PUT'
        }));
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        endSession();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      endSession();
    };
  }, [isClient, session, status, sessionId]);
  */

  // Activity logging function (internal)
  const logActivityInternal = async (type: string, description: string, metadata: any = {}) => {
    if (!session || status !== 'authenticated') return;
    
    try {
      await fetch('/api/user/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, description, metadata })
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  // Public activity logging function
  const logActivity = async (type: string, description: string, metadata: any = {}) => {
    await logActivityInternal(type, description, metadata);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Temporarily disable activity logging for dark mode toggle
    // logActivity('SETTINGS_CHANGE', `Dark mode ${!isDarkMode ? 'enabled' : 'disabled'}`, {
    //   setting: 'darkMode',
    //   value: !isDarkMode
    // });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const value: AppContextType = {
    isDarkMode,
    toggleDarkMode,
    isSidebarOpen,
    toggleSidebar,
    logActivity,
    sessionId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}; 