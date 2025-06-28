"use client";
import React from "react";
import Header from "./components/header/Header";
import PageStyle from "./Page.module.css";
import MainPageContent from "./components/mainpage/MainPageContent";
import JsTryEditor from "./components/tryeditor/JsTryEditor";
import SavadliButton from "./components/Buttons/savadliButton/SavadliButton";
import CopyButton from "./components/Buttons/copyButton/CopyButton";
import PayButton from "./components/Buttons/payButton/PayButton";
import RegisterButton from "./components/Buttons/registerButton/RegisterButton";
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
      <Footer/>
    </>
  );
}
