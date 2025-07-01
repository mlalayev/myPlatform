"use client";
import { useEffect, useState } from "react";
import CodeLoader from "./[lang]/components/loading/CodeLoader";

export default function ClientRedirect() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (window.location.pathname === "/") {
      setShowLoader(true);
      let lang = localStorage.getItem("selectedLanguage");
      if (!lang) {
        lang = "az";
        localStorage.setItem("selectedLanguage", lang);
      }
      setTimeout(() => {
        if (window.location.pathname !== `/${lang}`) {
          window.location.replace(`/${lang}`);
        }
      }, 600); // Show loader for at least 600ms
    }
  }, []);

  if (!showLoader) return null;

  return null;
}
