import React, { useState, useRef, useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";
import JsTryEditor from "../tryeditor/JsTryEditor";
import { FiChevronDown } from "react-icons/fi";
import styles from "./MainPageTryEditor.module.css";

interface EditorLanguage {
  label: string;
  value: string;
}

const MainPageTryEditor: React.FC = () => {
  const { t } = useI18n();
  const [editorLanguage, setEditorLanguage] = useState("javascript");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const editorLanguages: EditorLanguage[] = [
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Python", value: "python" },
    { label: "C++", value: "cpp" },
    // { label: "Python3", value: "python3" },
    // Languages that require external execution (commented out)
    // { label: "PHP", value: "php" },
    // { label: "Java", value: "java" },
    { label: "C", value: "c" },
    { label: "C#", value: "csharp" },
    // { label: "Go", value: "go" },
    // { label: "Rust", value: "rust" },
    // { label: "Ruby", value: "ruby" },
    // { label: "Swift", value: "swift" },
    // { label: "Kotlin", value: "kotlin" },
    // { label: "Dart", value: "dart" },
    // { label: "Scala", value: "scala" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Divide languages into two columns
  const leftLanguages = editorLanguages.slice(
    0,
    Math.ceil(editorLanguages.length / 2)
  );
  const rightLanguages = editorLanguages.slice(
    Math.ceil(editorLanguages.length / 2)
  );

  return (
    <section className={styles.introSection}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin:"0 0 10px 0",
          justifyContent: "space-between",
        }}
      >
        <h2 className={styles.introTitle}>{t("main.introTitle")}</h2>
        <div className={styles.languageDropdownWrapper} ref={dropdownRef}>
          <button
            className={styles.languageDropdownButton}
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span>
              {editorLanguages.find((l) => l.value === editorLanguage)?.label ||
                "Select Language"}
            </span>
            <FiChevronDown
              style={{
                marginLeft: 8,
                fontSize: 16,
                transition: "transform 0.2s ease",
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>
          {dropdownOpen && (
            <div className={styles.languageDropdownMenu} role="listbox">
              <div className={styles.languageDropdownColumn}>
                {leftLanguages.map((lang) => (
                  <button
                    key={lang.value}
                    className={
                      styles.languageDropdownItem +
                      (editorLanguage === lang.value
                        ? " " + styles.selected
                        : "")
                    }
                    onClick={() => {
                      setEditorLanguage(lang.value);
                      setDropdownOpen(false);
                    }}
                    type="button"
                    role="option"
                    aria-selected={editorLanguage === lang.value}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              <div className={styles.languageDropdownColumn}>
                {rightLanguages.map((lang) => (
                  <button
                    key={lang.value}
                    className={
                      styles.languageDropdownItem +
                      (editorLanguage === lang.value
                        ? " " + styles.selected
                        : "")
                    }
                    onClick={() => {
                      setEditorLanguage(lang.value);
                      setDropdownOpen(false);
                    }}
                    type="button"
                    role="option"
                    aria-selected={editorLanguage === lang.value}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <JsTryEditor
        showCopyButton={true}
        showRunButton={true}
        language={editorLanguage}
      />
    </section>
  );
};

export default MainPageTryEditor;
