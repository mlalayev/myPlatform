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
} from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";
import { useSession, signOut } from "next-auth/react";

const languages = [
  { code: "en", label: "EN" },
  { code: "az", label: "AZ" },
  { code: "ru", label: "RU" },
];

const Header: React.FC = () => {
  const { t } = useI18n();
  const { data: session } = useSession();
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
          <a
            key={item.label}
            href={item.href}
            className={HeaderStyle.navButton}
          >
            <span className={HeaderStyle.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </a>
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
        {!session?.user ? (
          <a
            href={`/${currentLang}/login`}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700 transition font-semibold ml-4"
          >
            Login
          </a>
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
                {(session.user as any).role === "ADMIN" && (
                  <a
                    href={`/${currentLang}/admin`}
                    className={HeaderStyle.profileOption}
                  >
                    🛠️ Admin Panel
                  </a>
                )}
                <button className={HeaderStyle.profileOption}>👤 {t("header.profile")}</button>
                <button className={HeaderStyle.profileOption}>⚙️ {t("header.settings")}</button>
                <hr className={HeaderStyle.divider} />
                <button
                  className={HeaderStyle.profileOption}
                  onClick={async () => {
                    setIsProfileDropdownOpen(false);
                    await signOut({ callbackUrl: `/${currentLang}/login` });
                  }}
                >
                  🔓 {t("header.logout")}
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