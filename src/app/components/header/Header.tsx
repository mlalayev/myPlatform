"use client";
import React, { useState, useRef, useEffect } from "react";
import HeaderStyle from "./Header.module.css";
import Image from "next/image";
import WhiteLogo from "@/../public/svg/whiteLogo.svg";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "Exercises", href: "/exercises" },
  { label: "Premium", href: "/premium" },
];

const Header: React.FC = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={HeaderStyle.header}>
      <div className={HeaderStyle.leftSection}>
        <Image src={WhiteLogo} alt="Logo" className={HeaderStyle.logo} />
      </div>
      <div className={HeaderStyle.navAndProfile}>
        <nav className={HeaderStyle.navbar}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className={HeaderStyle.navLink}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={HeaderStyle.profileDropdown} ref={profileDropdownRef}>
          <button
            className={HeaderStyle.profileButton}
            onClick={() => setIsProfileDropdownOpen((v) => !v)}
            aria-label="Profil"
          >
            <div className={HeaderStyle.avatar}>👤</div>
          </button>
          {isProfileDropdownOpen && (
            <div className={HeaderStyle.profileMenu}>
              <button className={HeaderStyle.profileOption}>👤 Profilim</button>
              <button className={HeaderStyle.profileOption}>⚙️ Ayarlar</button>
              <hr className={HeaderStyle.divider} />
              <button className={HeaderStyle.profileOption}>🔓 Çıxış</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
