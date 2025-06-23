"use client";
import React, { useState, useEffect, useRef } from 'react';
import HeaderStyle from './Header.module.css';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header 
      className={`${HeaderStyle.header} ${isSidebarOpen ? HeaderStyle.sidebarOpen : HeaderStyle.sidebarClosed}`}
    >
      <div className={HeaderStyle.leftSection}>
        <button 
          className={HeaderStyle.menuButton}
          onClick={onToggleSidebar}
          aria-label="Menu"
        >
          ☰
        </button>
      </div>

      <div className={HeaderStyle.rightSection}>
        <div className={HeaderStyle.searchContainer}>
          <input
            type="text"
            placeholder="Axtar..."
            className={HeaderStyle.searchInput}
          />
          <span className={HeaderStyle.searchIcon}>🔍</span>
        </div>
        <button
          className={HeaderStyle.darkModeButton}
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'İşıq rejimi' : 'Qaranlıq rejim'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        <div className={HeaderStyle.profileDropdown} ref={profileDropdownRef}>
          <button
            className={HeaderStyle.profileButton}
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
          >
            <div className={HeaderStyle.avatar}>👤</div>
          </button>
          {isProfileDropdownOpen && (
            <div className={HeaderStyle.profileMenu}>
              <button className={HeaderStyle.profileOption}>
                👤 Profilim
              </button>
              <button className={HeaderStyle.profileOption}>
                ⚙️ Ayarlar
              </button>
              <hr className={HeaderStyle.divider} />
              <button className={HeaderStyle.profileOption}>
                🔓 Çıxış
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 