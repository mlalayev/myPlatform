"use client";
import React, { useState, useRef, useEffect } from "react";
import HeaderStyle from "./Header.module.css";
import Image from "next/image";
import WhiteLogo from "@/../public/svg/whiteLogo.svg";
import {
  FiHome,
  FiBookOpen,
  FiEdit,
  FiStar,
  FiArrowUpRight,
  FiLogIn,
  FiUser,
  FiSettings,
  FiLogOut,
  FiShield,
} from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const languages = [
  { code: "en", label: "EN" },
  { code: "az", label: "AZ" },
  { code: "ru", label: "RU" },
];

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Debug logging for session data
  useEffect(() => {
    if (session?.user) {
      console.log("Header - Session user data:", {
        id: (session.user as any).id,
        name: session.user.name,
        email: session.user.email,
        avatarUrl: (session.user as any).avatarUrl,
        role: (session.user as any).role
      });
    }
  }, [session]);

  // Make currentLang reactive to route changes
  const currentLang = pathname.split("/")[1] || "en";

  const navItems = [
    { label: t("header.home"), href: `/${currentLang}`, icon: <FiHome /> },
    { label: t("header.tutorials"), href: `/${currentLang}/tutorials`, icon: <FiBookOpen /> },
    { label: t("header.exercises"), href: `/${currentLang}/exercises`, icon: <FiEdit /> },
    { label: t("header.premium"), href: `/${currentLang}/premium`, icon: <FiStar /> },
  ];

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

  const handleLangChange = (lang: string) => {
    localStorage.setItem("selectedLanguage", lang);
    const segments = pathname.split("/");
    segments[1] = lang;
    router.push(segments.join("/"));
    setDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className={HeaderStyle.header}>
      <div className={HeaderStyle.leftSection}>
        <Image src={WhiteLogo} alt="Logo" className={HeaderStyle.logo} />
      </div>
      <nav className={HeaderStyle.navbar}>
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={HeaderStyle.navButton}
          >
            <span className={HeaderStyle.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className={HeaderStyle.rightSection}>
        <div className={HeaderStyle.languageDropdownWrapper} ref={dropdownRef}>
          <button
            className={HeaderStyle.languageDropdownButton}
            onClick={() => setDropdownOpen((open) => !open)}
            aria-label="Select language"
          >
            <span className={HeaderStyle.languageDropdownLabel}>
              {languages.find((l) => l.code === currentLang)?.label || "EN"}
            </span>
            <svg
              className={`${HeaderStyle.languageDropdownIcon} ${dropdownOpen ? HeaderStyle.languageDropdownIconRotated : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className={HeaderStyle.languageDropdownMenu}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={
                    currentLang === lang.code
                      ? HeaderStyle.languageDropdownItemActive
                      : HeaderStyle.languageDropdownItem
                  }
                  onClick={() => handleLangChange(lang.code)}
                  aria-label={`Switch to ${lang.label}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {status === "loading" ? (
          null
        ) : !session?.user ? (
          <Link
            href={`/${currentLang}/login`}
            className={HeaderStyle.loginButton}
            aria-label="Login"
          >
            <span className={HeaderStyle.loginIcon}><FiLogIn /></span>
            Login
          </Link>
        ) : (
          <div className={HeaderStyle.profileDropdown} ref={profileDropdownRef}>
            <button
              className={HeaderStyle.profileButton}
              onClick={() => setIsProfileDropdownOpen((v) => !v)}
              aria-label="Profil"
            >
              {(() => {
                const avatarUrl = (session.user as any).avatarUrl;
                
                if (avatarUrl) {
                  return (
                    <img 
                      src={avatarUrl} 
                      alt="avatar" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" 
                    />
                  );
                } else {
                  return (
                <div className={HeaderStyle.avatar}>
                  {session.user.name?.[0]?.toUpperCase() || "👤"}
                </div>
                  );
                }
              })()}
            </button>
            {isProfileDropdownOpen && (
              <div className={HeaderStyle.profileMenu}>
                <div className={HeaderStyle.profileMenuUser}>
                  {(session.user as any).avatarUrl ? (
                    <img 
                      src={(session.user as any).avatarUrl} 
                      alt="avatar" 
                      className={HeaderStyle.profileMenuAvatar} 
                    />
                  ) : (
                    <div className={HeaderStyle.profileMenuAvatar}>
                      {session.user.name?.[0]?.toUpperCase() || "👤"}
                    </div>
                  )}
                  <div>
                    <div className={HeaderStyle.profileMenuName}>{session.user.name}</div>
                    <div className={HeaderStyle.profileMenuEmail}>{(session.user as any).username || session.user.email}</div>
                  </div>
                </div>
                <hr className={HeaderStyle.profileMenuDivider} />
                {(session.user as any).role === "ADMIN" && (
                  <a
                    href={`/${currentLang}/admin`}
                    className={HeaderStyle.profileOption}
                  >
                    <span className={HeaderStyle.profileOptionIcon}><FiShield /></span>
                    Admin Panel
                  </a>
                )}
                <button className={HeaderStyle.profileOption} onClick={() => {
                  setIsProfileDropdownOpen(false);
                  router.push(`/${currentLang}/profile`);
                }}>
                  <span className={HeaderStyle.profileOptionIcon}><FiUser /></span>
                  {t("header.profile")}
                </button>
                <button 
                  className={HeaderStyle.profileOption}
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    router.push(`/${currentLang}/settings`);
                  }}
                >
                  <span className={HeaderStyle.profileOptionIcon}><FiSettings /></span>
                  {t("header.settings")}
                </button>
                <hr className={HeaderStyle.profileMenuDivider} />
                <button
                  className={HeaderStyle.profileOption}
                  onClick={async () => {
                    setIsProfileDropdownOpen(false);
                    await signOut({ callbackUrl: `/${currentLang}/login` });
                  }}
                >
                  <span className={HeaderStyle.profileOptionIcon}><FiLogOut /></span>
                  {t("header.logout")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;