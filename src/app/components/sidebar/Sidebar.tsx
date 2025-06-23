"use client";
import React from "react";
import SidebarStyle from "./Sidebar.module.css";
import Image from "next/image";
import WhiteLogo from "@/../public/svg/whiteLogo.svg";
import bookLogo from "@/../public/svg/bookLogo.svg";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const navigationItems = [
    { icon: "🏠", label: "Home", href: "/" },
    { icon: "📚", label: "Tutorials", href: "/tutorials" },
    { icon: "🎥", label: "Courses", href: "/courses" },
    { icon: "🧩", label: "Exercises", href: "/exercises" },
    { icon: "💡", label: "Live Examples", href: "/examples" },
  ];

  const extraItems = [
    { icon: "🌟", label: "Premium Membership", href: "/premium" },
    { icon: "📣", label: "News & Updates", href: "/news" },
  ];

  return (
    <div
      className={`${SidebarStyle.sidebar} ${
        isOpen ? SidebarStyle.open : SidebarStyle.closed
      }`}
    >
      <div className={SidebarStyle.logoSection}>
        <Image
          className={isOpen ? SidebarStyle.logo : SidebarStyle.bookLogo}
          src={isOpen ? WhiteLogo : bookLogo}
          alt="savadli.az"
        />
      </div>
      <nav className={SidebarStyle.navigation}>
        <div className={SidebarStyle.section}>
          {isOpen && <h3 className={SidebarStyle.sectionTitle}>Navigation</h3>}
          <ul className={SidebarStyle.navList}>
            {navigationItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className={SidebarStyle.navLink}
                  title={!isOpen ? item.label : undefined}
                >
                  <span className={SidebarStyle.icon}>{item.icon}</span>
                  {isOpen && <span className={SidebarStyle.label}>{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className={SidebarStyle.section}>
          {isOpen && <h3 className={SidebarStyle.sectionTitle}>Extra</h3>}
          <ul className={SidebarStyle.navList}>
            {extraItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className={SidebarStyle.navLink}
                  title={!isOpen ? item.label : undefined}
                >
                  <span className={SidebarStyle.icon}>{item.icon}</span>
                  {isOpen && <span className={SidebarStyle.label}>{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className={SidebarStyle.content}>
        <div className={SidebarStyle.scrollableContent}>
          {/* Remove navigation from here */}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
