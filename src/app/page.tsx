"use client";
import React, { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import PageStyle from './Page.module.css';
import MainPageContent from "./components/mainpage/MainPageContent";

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
      <div className={PageStyle.layout}>
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div className={isSidebarOpen ? PageStyle.contentOpen : PageStyle.contentClosed}>
          <MainPageContent />
        </div>
      </div>
    </>
  );
}
