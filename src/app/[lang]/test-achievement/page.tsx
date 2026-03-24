"use client";

import React from "react";
import { useAchievement } from "../../../contexts/AchievementContext";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function TestAchievementPage() {
  const { showAchievementPopup } = useAchievement();

  const testAchievement = {
    name: "Test Achievement",
    description: "This is a test achievement to verify global popup functionality",
    rarity: "gold" as const,
    coins: 50
  };

  const handleTestAchievement = () => {
    showAchievementPopup(testAchievement);
  };

  return (
    <>
      <Header />
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center",
        padding: "20px"
      }}>
        <h1>Test Achievement Popup</h1>
        <p>This page tests the global achievement popup functionality.</p>
        <button 
          onClick={handleTestAchievement}
          style={{
            padding: "12px 24px",
            backgroundColor: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          Trigger Test Achievement
        </button>
        <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Click the button above to test if the achievement popup appears globally.
        </p>
      </div>
      <Footer />
    </>
  );
} 