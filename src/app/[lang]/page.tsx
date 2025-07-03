"use client";
import React from "react";
import Header from "./components/header/Header";
import PageStyle from "../Page.module.css";
import MainPageContent from "./components/mainpage/MainPageContent";
import Footer from "./components/footer/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <div className={PageStyle.layout}>
        <div className={PageStyle.contentOpen}>
          <MainPageContent />
        </div>
      </div>
      <Footer />
    </>
  );
}
