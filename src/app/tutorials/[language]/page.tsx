"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TutorialLanguagePage() {
  const { language } = useParams<{ language: string }>();
  const router = useRouter();

  useEffect(() => {
    if (!language) return;
    
    // Redirect to the first topic of this language
    fetch(`/api/tutorials/${language}/topics`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          router.replace(`/tutorials/${language}/${data[0].id}`);
        }
      })
      .catch((error) => {
        console.error('Error loading topics:', error);
      });
  }, [language, router]);

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
