"use client";
import { useEffect, useState } from "react";
import CodeLoader from "./[lang]/components/loading/CodeLoader";
import { useRouter } from "next/navigation";

export default function ClientRedirect() {
  const [showLoader, setShowLoader] = useState(false);
  const router = useRouter();

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
          router.replace(`/${lang}`);
        }
      }, 600); // Show loader for at least 600ms
    }
  }, [router]);

  if (!showLoader) return null;

  return null;
}
