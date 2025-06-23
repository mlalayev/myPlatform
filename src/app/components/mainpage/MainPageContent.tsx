import React from "react";
import styles from "./MainPageContent.module.css";

const features = [
  { icon: "🔢", label: "Massivlər" },
  { icon: "🔄", label: "Rekursiya" },
  { icon: "🗂️", label: "Ağaclar" },
  { icon: "🔗", label: "Qraf" },
];

export default function MainPageContent() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Alqoritmlər və Məlumat Strukturunu Öyrən
        </h1>
        <p className={styles.subtitle}>
          Əsas anlayışları mənimsə və proqramlaşdırma bacarıqlarını inkişaf
          etdir
        </p>
        <button className={styles.cta}>Başla</button>
      </section>
      <section className={styles.features}>
        {features.map((f) => (
          <div className={styles.featureCard} key={f.label}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <span className={styles.featureLabel}>{f.label}</span>
          </div>
        ))}
      </section>
      <section className={styles.introSection}>
        <h2 className={styles.introTitle}>Giriş</h2>
        <pre className={styles.codeBlock}>
          {`
          function giris() {
            var movzu = 'Massivlər';
            // Nümunə mətn
          }
          `}
        </pre>
      </section>
    </main>
  );
}
