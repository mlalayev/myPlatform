import React from "react";
import styles from "./CodeLoader.module.css";

export default function CodeLoader() {
  return (
    <div className={styles.codeLoader}>
      <span>{'{'}</span>
      <span>{'}'}</span>
    </div>
  );
} 