"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../login/LoginPage.module.css";
import { FiUserPlus } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useI18n } from "@/contexts/I18nContext";

// Signup page for the platform, matching the login page design and using translations
export default function SignupPage() {
  const { t, lang } = useI18n();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError(t("signup.passwordMismatch"));
      return;
    }
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }
      router.push(`/${lang}/login`);
    } catch (err) {
      setError("Signup failed");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <h2 className={styles.title}>{t("signup.title")}</h2>
        <input
          type="text"
          placeholder={t("signup.name")}
          className={styles.input}
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder={t("signup.surname")}
          className={styles.input}
          value={surname}
          onChange={e => setSurname(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder={t("signup.username")}
          className={styles.input}
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder={t("signup.email")}
          className={styles.input}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t("signup.password")}
          className={styles.input}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t("signup.confirm")}
          className={styles.input}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.loginButton}>
          <span className={styles.loginIcon}><FiUserPlus /></span>
          {t("signup.button")}
        </button>
        <button
          type="button"
          className={styles.googleButton}
          onClick={() => signIn("google", { callbackUrl: `/${lang}` })}
        >
          <span className={styles.googleIcon}><FcGoogle /></span>
          {t("signup.google")}
        </button>
        <div className={styles.signupText}>
          {t("signup.haveAccount")} <a href={`/${lang}/login`} className={styles.signupLink}>{t("signup.login")}</a>
        </div>
      </form>
    </div>
  );
} 