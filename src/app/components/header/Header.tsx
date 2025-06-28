"use client";
import React, { useState, useRef, useEffect } from "react";
import HeaderStyle from "./Header.module.css";
import Image from "next/image";
import WhiteLogo from "@/../public/svg/whiteLogo.svg";
import { FiHome, FiBookOpen, FiEdit, FiStar, FiArrowUpRight } from "react-icons/fi";

const navItems = [
  { label: "Home", href: "/", icon: <FiHome /> },
  { label: "Tutorials", href: "/tutorials", icon: <FiBookOpen /> },
  { label: "Exercises", href: "/exercises", icon: <FiEdit /> },
  { label: "Premium", href: "/premium", icon: <FiStar /> },
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
      {/* <div className={HeaderStyle.navAndProfile}> */}
        <nav className={HeaderStyle.navbar}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className={HeaderStyle.navButton}>
              <span className={HeaderStyle.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
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
      {/* </div> */}
    </header>
  );
};

export default Header;
