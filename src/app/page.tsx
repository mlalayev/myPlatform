"use client";
import React, { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import PageStyle from './Page.module.css';

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
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
            tempore, vero illum omnis quis repellat iste optio magni at eos sit
            perferendis illo molestiae quasi aperiam a deserunt totam sequi
            facilis adipisci quod deleniti culpa, quisquam eligendi? Id
            provident iure possimus maiores commodi dolorum optio voluptates
            nesciunt accusantium animi quas harum omnis perspiciatis laborum
            explicabo ipsum eius, quasi atque amet similique! Dicta dolores
            ipsum iusto alias. A rerum veritatis impedit architecto adipisci
            consectetur fugiat aperiam sapiente dicta. Odio non officiis fuga
            quidem quisquam itaque. Praesentium vitae iure sunt temporibus culpa
            repudiandae cum vel, doloribus sit beatae at repellendus molestias
            voluptas est architecto, ex nisi eligendi quaerat consequuntur alias
            perspiciatis quo ipsa, nulla eius. Reiciendis pariatur porro magnam
            itaque! Debitis deleniti doloribus iste autem enim quod minima
            fugit. Nam eius sed dolore repellendus velit expedita suscipit eos
            rerum perspiciatis maxime autem veritatis dignissimos nihil quis
            perferendis minima exercitationem, architecto quia. Similique,
            dolores molestias? Animi laborum veniam ad obcaecati nulla velit
            corrupti eos quidem, aperiam magni deleniti eius blanditiis
            expedita, veritatis rem, dolores harum eligendi earum accusantium
            magnam reiciendis deserunt repellendus ea eaque? Perferendis
            consectetur commodi earum pariatur laborum! Aliquam iste commodi,
            repellendus dolor, et, perferendis voluptates vel nesciunt vero
            maxime dolores.
          </p>

        </div>
      </div>
    </>
  );
}
