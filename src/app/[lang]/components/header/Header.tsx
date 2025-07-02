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
  const { t } = useI18n();
  const { data: session, status } = useSession();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
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
              {languages.find((l) => l.code === currentLang)?.label || "LANG"}
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              style={{ marginLeft: 6 }}
            >
              <path
                d="M6 8l4 4 4-4"
                stroke="#6c3fc5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className={HeaderStyle.languageDropdownMenu}>
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className={
                    currentLang === lang.code
                      ? HeaderStyle.languageDropdownItemActive
                      : HeaderStyle.languageDropdownItem
                  }
                  onClick={() => handleLangChange(lang.code)}
                  tabIndex={0}
                  role="button"
                  aria-label={lang.label}
                >
                  {lang.label}
                </div>
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
              {(session.user as any).avatar ? (
                <img src={(session.user as any).avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className={HeaderStyle.avatar}>
                  {session.user.name?.[0]?.toUpperCase() || "👤"}
                </div>
              )}
            </button>
            {isProfileDropdownOpen && (
              <div className={HeaderStyle.profileMenu}>
                <div className={HeaderStyle.profileMenuUser}>
                  {(session.user as any).avatar ? (
                    <img src={(session.user as any).avatar} alt="avatar" className={HeaderStyle.profileMenuAvatar} />
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
                <button className={HeaderStyle.profileOption}>
                  <span className={HeaderStyle.profileOptionIcon}><FiUser /></span>
                  {t("header.profile")}
                </button>
                <button className={HeaderStyle.profileOption}>
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