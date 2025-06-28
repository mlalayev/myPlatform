import styles from "./Footer.module.css";
import Image from "next/image";
import Link from "next/link";
import { FiX, FiInstagram, FiLinkedin, FiGithub } from "react-icons/fi";
import logo from "@/../public/svg/whiteLogo.svg";

export default function Footer() {
  return (
    <footer className={styles.footerOuter}>
      <div className={styles.footerInner}>
        <div className={styles.footerLeft}>
          <div className={styles.logoRow}>
            <Image src={logo} alt="Logo" className={styles.logo} />
            {/* <span className={styles.brand}>MyPlatform</span> */}
          </div>
          <p className={styles.desc}>
            Platform empowers users to learn algorithms and data structures with
            interactive tutorials and exercises.
          </p>
          <div className={styles.socials}>
            <a href="#" aria-label="X" className={styles.social}>
              <FiX />
            </a>
            <a href="#" aria-label="Instagram" className={styles.social}>
              <FiInstagram />
            </a>
            <a href="#" aria-label="LinkedIn" className={styles.social}>
              <FiLinkedin />
            </a>
            <a href="#" aria-label="GitHub" className={styles.social}>
              <FiGithub />
            </a>
          </div>
        </div>
        <div className={styles.footerLinks}>
          <div>
            <div className={styles.linkTitle}>Product</div>
            <Link href="/features" className={styles.link}>
              Features
            </Link>
            <Link href="/pricing" className={styles.link}>
              Pricing
            </Link>
            <Link href="/integrations" className={styles.link}>
              Integrations
            </Link>
            <Link href="/changelog" className={styles.link}>
              Changelog
            </Link>
          </div>
          <div>
            <div className={styles.linkTitle}>Resources</div>
            <Link href="/docs" className={styles.link}>
              Documentation
            </Link>
            <Link href="/tutorials" className={styles.link}>
              Tutorials
            </Link>
            <Link href="/blog" className={styles.link}>
              Blog
            </Link>
            <Link href="/support" className={styles.link}>
              Support
            </Link>
          </div>
          <div>
            <div className={styles.linkTitle}>Company</div>
            <Link href="/about" className={styles.link}>
              About
            </Link>
            <Link href="/careers" className={styles.link}>
              Careers
            </Link>
            <Link href="/contact" className={styles.link}>
              Contact
            </Link>
            <Link href="/partners" className={styles.link}>
              Partners
            </Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2025 MyPlatform. All rights reserved.</span>
          <div className={styles.policyLinks}>
            <Link href="/privacy" className={styles.policyLink}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={styles.policyLink}>
              Terms of Service
            </Link>
            <Link href="/cookies" className={styles.policyLink}>
              Cookies Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
