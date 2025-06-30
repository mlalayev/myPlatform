"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TutorialLanguagePage() {
  const { language, lang } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!language || !lang) return;
    fetch(`/api/tutorials/${language}/topics`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          router.replace(`/${lang}/tutorials/${language}/${data[0].id}`);
        }
      })
      .catch((error) => {
        console.error('Error loading topics:', error);
      });
  }, [language, lang, router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px',
      color: '#666'
    }}>
      Yönləndirilir...
    </div>
  );
}