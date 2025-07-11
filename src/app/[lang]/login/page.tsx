"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginPage.module.css";
import { FiLogIn } from "react-icons/fi";
import { useI18n } from "@/contexts/I18nContext";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { t, lang } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: `/${lang}`,
      remember: remember ? "1" : "0",
    });
    if (res?.error) setError("Invalid credentials");
    else router.push(`/${lang}`);
  };

  return (
    <div className={styles.container}>
      <form
        onSubmit={handleSubmit}
        className={styles.card}
      >
        <h2 className={styles.title}>{t("login.title")}</h2>
        <input
          type="email"
          placeholder={t("login.email")}
          className={styles.input}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t("login.password")}
          className={styles.input}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <div className={styles.checkboxRow}>
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            className={styles.checkbox}
          />
          <label htmlFor="remember" className={styles.checkboxLabel}>{t("login.remember")}</label>
        </div>
        {error && <div className={styles.error}>{t("login.invalid")}</div>}
        <button
          type="submit"
          className={styles.loginButton}
        >
          <span className={styles.loginIcon}><FiLogIn /></span>
          {t("login.button")}
        </button>
        <button
          type="button"
          className={styles.googleButton}
          onClick={() => signIn("google", { callbackUrl: `/${lang}` })}
        >
          <span className={styles.googleIcon}><FcGoogle /></span>
          {t("login.google")}
        </button>
        <div className={styles.signupText}>
          {t("login.noAccount")} <a href={`/${lang}/signup`} className={styles.signupLink}>{t("login.signup")}</a>
        </div>
      </form>
    </div>
  );
} 