"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TutorialsPage;
var TutorialsPage_module_css_1 = require("./TutorialsPage.module.css");
var fi_1 = require("react-icons/fi");
var si_1 = require("react-icons/si");
var link_1 = require("next/link");
var Header_1 = require("../components/header/Header");
var languages = [
    {
        name: "JavaScript",
        icon: <si_1.SiJavascript size={38} color="#f7df1e"/>,
        available: true,
        href: "/tutorials/javascript",
        description: "Web frontend/backend üçün."
    },
    {
        name: "Alqoritmlər",
        icon: <fi_1.FiSettings size={38} color="#6c3fc5"/>,
        available: true,
        href: "/tutorials/algorithms",
        description: "Əsas alqoritmlər və onların tətbiqləri."
    },
    {
        name: "Məlumat Strukturları",
        icon: <fi_1.FiLayers size={38} color="#6c3fc5"/>,
        available: true,
        href: "/tutorials/data-structures",
        description: "Massivlər, siyahılar, ağaclar və s."
    },
    {
        name: "Python",
        icon: <si_1.SiPython size={38} color="#3572A5"/>,
        available: false,
        description: "Data science, AI, scripting, backend."
    },
    {
        name: "Java",
        icon: <si_1.SiJava size={38} color="#b07219"/>,
        available: false,
        description: "Android, enterprise app-lar."
    },
    {
        name: "C",
        icon: <si_1.SiC size={38} color="#00599C"/>,
        available: false,
        description: "Sistem proqramlaşdırma, OS."
    },
    {
        name: "C++",
        icon: <si_1.SiCplusplus size={38} color="#00599C"/>,
        available: false,
        description: "Oyunlar, performans tələb edən proqramlar."
    },
    {
        name: "C#",
        icon: <si_1.SiCsharp size={38} color="#178600"/>,
        available: false,
        description: "Microsoft .NET, oyunlar (Unity)."
    },
    {
        name: "Go (Golang)",
        icon: <si_1.SiGo size={38} color="#00ADD8"/>,
        available: false,
        description: "Performanslı backend sistemləri."
    },
    {
        name: "Rust",
        icon: <si_1.SiRust size={38} color="#dea584"/>,
        available: false,
        description: "Təhlükəsizlik və performans üçün (C/C++ alternativi)."
    },
    {
        name: "TypeScript",
        icon: <si_1.SiTypescript size={38} color="#3178c6"/>,
        available: false,
        description: "JavaScript-in tipli versiyası (web development)."
    },
    {
        name: "PHP",
        icon: <si_1.SiPhp size={38} color="#777bb4"/>,
        available: false,
        description: "Web backend (WordPress və s.)."
    },
    {
        name: "Swift",
        icon: <si_1.SiSwift size={38} color="#ffac45"/>,
        available: false,
        description: "iOS/macOS app-lar üçün."
    },
    {
        name: "Kotlin",
        icon: <si_1.SiKotlin size={38} color="#7f52ff"/>,
        available: false,
        description: "Android development (Java alternativi)."
    },
    {
        name: "Ruby",
        icon: <si_1.SiRuby size={38} color="#cc342d"/>,
        available: false,
        description: "Web backend (Ruby on Rails)."
    },
    {
        name: "R",
        icon: <si_1.SiR size={38} color="#276dc3"/>,
        available: false,
        description: "Statistik analiz və datayla işləmək üçün."
    },
    {
        name: "SQL",
        icon: <si_1.SiMysql size={38} color="#00758f"/>,
        available: false,
        description: "Verilənlər bazası sorğuları üçün."
    },
    {
        name: "Shell/Bash",
        icon: <si_1.SiGnubash size={38} color="#4eaa25"/>,
        available: false,
        description: "Sistem əmrləri və avtomatlaşdırma üçün."
    },
    {
        name: "MATLAB",
        icon: <si_1.SiMatlab size={38} color="#e16737"/>,
        available: false,
        description: "Elmi hesablamalar və riyazi modellər."
    },
    {
        name: "Scala",
        icon: <si_1.SiScala size={38} color="#c22d40"/>,
        available: false,
        description: "Functional + OOP (Java ilə inteqrasiya olunur)."
    },
    {
        name: "Dart",
        icon: <si_1.SiDart size={38} color="#00b4ab"/>,
        available: false,
        description: "Flutter ilə mobil app development."
    },
    {
        name: "Haskell",
        icon: <si_1.SiHaskell size={38} color="#5e5086"/>,
        available: false,
        description: "Functional programming."
    },
];
function TutorialsPage() {
    return (<div className={TutorialsPage_module_css_1.default.tutorialsWrapper}>
      <Header_1.default />
      <h1 className={TutorialsPage_module_css_1.default.tutorialsTitle}>Proqramlaşdırma Dilləri</h1>
      <div className={TutorialsPage_module_css_1.default.languagesGrid}>
        {languages.map(function (lang) {
            return lang.available ? (<link_1.default href={lang.href} className={TutorialsPage_module_css_1.default.languageCard} key={lang.name}>
              <div className={TutorialsPage_module_css_1.default.languageIcon}>{lang.icon}</div>
              <div className={TutorialsPage_module_css_1.default.languageName}>{lang.name}</div>
              <div className={TutorialsPage_module_css_1.default.languageDesc}>{lang.description}</div>
              <span className={TutorialsPage_module_css_1.default.languageArrow}><fi_1.FiChevronRight size={22}/></span>
            </link_1.default>) : (<div className={TutorialsPage_module_css_1.default.languageCardUnavailable} key={lang.name}>
              <div className={TutorialsPage_module_css_1.default.languageIcon}>{lang.icon}</div>
              <div className={TutorialsPage_module_css_1.default.languageName}>{lang.name}</div>
              <div className={TutorialsPage_module_css_1.default.languageDesc}>{lang.description}</div>
              <div className={TutorialsPage_module_css_1.default.comingSoon}>Tezliklə...</div>
            </div>);
        })}
      </div>
    </div>);
}
