"use client";
import React, { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import PageStyle from './Page.module.css';
import MainPageContent from "./components/mainpage/MainPageContent";
import JsTryEditor from "./components/tryeditor/JsTryEditor";

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
      <div
        className={PageStyle.layout}
      >
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div
          className={isSidebarOpen ? PageStyle.contentOpen : PageStyle.contentClosed}
        >
          <h1>Welcome to Savadli Platform</h1>
          <MainPageContent/>
          <JsTryEditor></JsTryEditor>
        </div>
      </div>
    </>
  );
}
