import React from "react";
import { useI18n } from "@/contexts/I18nContext";
import {
  SiJavascript,
  SiCss3,
  SiNodedotjs,
  SiOpenjdk,
  SiSharp,
  SiKotlin,
  SiSwift,
  SiCplusplus,
} from "react-icons/si";
import styles from "./LanguagesSection.module.css";

type LangSlug =
  | "javascript"
  | "css"
  | "nodejs"
  | "java"
  | "csharp"
  | "kotlin"
  | "swift"
  | "cpp";

interface LanguageItem {
  name: string;
  slug: LangSlug;
  Icon: typeof SiJavascript;
  color: string;
}

const languages: LanguageItem[] = [
  { name: "JavaScript", slug: "javascript", Icon: SiJavascript, color: "#f7df1e" },
  { name: "CSS", slug: "css", Icon: SiCss3, color: "#1572b6" },
  { name: "Node.js", slug: "nodejs", Icon: SiNodedotjs, color: "#339933" },
  { name: "Java", slug: "java", Icon: SiOpenjdk, color: "#b07219" },
  { name: "C#", slug: "csharp", Icon: SiSharp, color: "#178600" },
  { name: "Kotlin", slug: "kotlin", Icon: SiKotlin, color: "#7f52ff" },
  { name: "Swift", slug: "swift", Icon: SiSwift, color: "#ffac45" },
  { name: "C++", slug: "cpp", Icon: SiCplusplus, color: "#00599C" },
];

const LanguagesSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className={styles.languagesSection} aria-labelledby="languages-heading">
      <div className={styles.head}>
        <h2 id="languages-heading" className={styles.languagesTitle}>
          {t("main.languagesTitle")}
        </h2>
        <p className={styles.subtitle}>{t("main.languagesSubtitle")}</p>
      </div>
      <ul className={styles.grid}>
        {languages.map(({ name, slug, Icon, color }) => (
          <li key={name} className={styles.card}>
            <div className={styles.iconBadge} aria-hidden>
              <Icon className={styles.iconSvg} color={color} title="" />
            </div>
            <h3 className={styles.cardTitle}>{name}</h3>
            <p className={styles.cardDesc}>{t(`main.langCards.${slug}`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LanguagesSection;
