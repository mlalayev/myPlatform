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
  FiLogIn,
  FiUser,
  FiSettings,
  FiLogOut,
  FiShield,
  FiMenu,
  FiX,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // OPTIMIZED: Removed debug logging for better performance

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px)");
    const onChange = () => {
      if (mq.matches) setMobileMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    onChange();
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        mobileNavRef.current?.contains(t) ||
        menuButtonRef.current?.contains(t)
      ) {
        return;
      }
      setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [mobileMenuOpen]);

  return (
    <header className={HeaderStyle.header}>
      <div className={HeaderStyle.leftSection}>
        <Link href={`/${currentLang}`} className={HeaderStyle.logoLink}>
          <Image src={WhiteLogo} alt="Logo" className={HeaderStyle.logo} priority />
        </Link>
      </div>
      <nav
        className={`${HeaderStyle.navbar} ${HeaderStyle.navbarDesktop}`}
        aria-label={t("header.mainNavigation")}
      >
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
            <span className={HeaderStyle.loginLabel}>Login</span>
          </Link>
        ) : (
          <div className={HeaderStyle.profileDropdown} ref={profileDropdownRef}>
            <button
              className={HeaderStyle.profileButton}
              onClick={() => setIsProfileDropdownOpen((v) => !v)}
              aria-label="Profil"
            >
              {(() => {
                const avatarUrl = (session.user as unknown as { avatarUrl: string })?.avatarUrl;
                
                if (avatarUrl) {
                  return (
                    <Image 
                      src={avatarUrl} 
                      alt="avatar" 
                      width={32}
                      height={32}
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
                  {(session.user as unknown as { avatarUrl: string })?.avatarUrl ? (
                    <Image 
                      src={(session.user as unknown as { avatarUrl: string }).avatarUrl} 
                      alt="avatar" 
                      width={40}
                      height={40}
                      className={HeaderStyle.profileMenuAvatar} 
                    />
                  ) : (
                    <div className={HeaderStyle.profileMenuAvatar}>
                      {session.user.name?.[0]?.toUpperCase() || "👤"}
                    </div>
                  )}
                  <div>
                    <div className={HeaderStyle.profileMenuName}>{session.user.name}</div>
                    <div className={HeaderStyle.profileMenuEmail}>{(session.user as unknown as { username: string }).username || session.user.email}</div>
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
        <button
          ref={menuButtonRef}
          type="button"
          className={`${HeaderStyle.menuButton} ${HeaderStyle.menuToggle}`}
          aria-expanded={mobileMenuOpen}
          aria-controls="header-mobile-nav"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? t("header.closeMenu") : t("header.openMenu")}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <nav
        ref={mobileNavRef}
        id="header-mobile-nav"
        className={`${HeaderStyle.mobileNav} ${mobileMenuOpen ? HeaderStyle.mobileNavOpen : ""}`}
        aria-hidden={!mobileMenuOpen}
        aria-label={t("header.mainNavigation")}
      >
        {navItems.map((item) => (
          <Link
            key={`m-${item.label}`}
            href={item.href}
            className={HeaderStyle.mobileNavLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className={HeaderStyle.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;