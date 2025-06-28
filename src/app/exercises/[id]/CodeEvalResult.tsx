import React from "react";
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiCode, FiTarget, FiClock } from "react-icons/fi";
import styles from "./CodeEvalResult.module.css";

interface FailedCase {
  input: string;
  output: string;
  expected: string;
}

interface CodeEvalResultProps {
  status: "correct" | "wrong";
  passedCount: number;
  totalCount: number;
  failedCases: FailedCase[];
  onAnalyzeComplexity?: () => void;
}

const CodeEvalResult: React.FC<CodeEvalResultProps> = ({
  status,
  passedCount,
  totalCount,
  failedCases,
  onAnalyzeComplexity,
}) => {
  const isCorrect = status === "correct";
  const passedPercentage = Math.round((passedCount / totalCount) * 100);

  return (
    <div className={styles.resultContainer}>
      {/* Header Section */}
      <div className={styles.resultHeader}>
        <div className={styles.statusSection}>
          <div className={`${styles.statusIcon} ${isCorrect ? styles.success : styles.error}`}>
            {isCorrect ? <FiCheckCircle /> : <FiXCircle />}
          </div>
          <div className={styles.statusContent}>
            <h3 className={styles.statusTitle}>
              {isCorrect ? "Bütün testlər keçdi!" : "Bəzi testlər uğursuz oldu"}
            </h3>
            <p className={styles.statusSubtitle}>
              {isCorrect 
                ? "Təbriklər! Kodunuz bütün test hallarını uğurla keçdi."
                : "Kodunuzda bəzi xətalar var. Aşağıdakı test hallarını yoxlayın."
              }
            </p>
          </div>
        </div>
        
        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <FiTarget className={styles.statIcon} />
              <span className={styles.statLabel}>Test Nəticələri</span>
            </div>
            <div className={styles.statValue}>
              <span className={`${styles.passedCount} ${isCorrect ? styles.allPassed : ""}`}>
                {passedCount}
              </span>
              <span className={styles.totalCount}>/ {totalCount}</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${isCorrect ? styles.success : styles.error}`}
                style={{ width: `${passedPercentage}%` }}
              ></div>
            </div>
            <div className={styles.percentageText}>
              {passedPercentage}% uğurlu
            </div>
          </div>
        </div>
      </div>

      {/* Failed Cases Section */}
      {failedCases.length > 0 && (
        <div className={styles.failedCasesSection}>
          <div className={styles.sectionHeader}>
            <FiAlertTriangle className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>
              İlk Uğursuz Test Halı
            </h4>
          </div>
          
          <div className={styles.failedCasesList}>
            <div className={styles.failedCaseCard}>
              <div className={styles.caseHeader}>
                <span className={styles.caseNumber}>Test #{1}</span>
                <div className={styles.caseStatus}>
                  <FiXCircle className={styles.failIcon} />
                  <span>Uğursuz</span>
                </div>
              </div>
              
              <div className={styles.caseContent}>
                <div className={styles.caseRow}>
                  <div className={styles.caseLabel}>
                    <FiCode className={styles.caseIcon} />
                    <span>Input:</span>
                  </div>
                  <code className={styles.caseValue}>{failedCases[0].input}</code>
                </div>
                
                <div className={styles.caseRow}>
                  <div className={styles.caseLabel}>
                    <FiInfo className={styles.caseIcon} />
                    <span>Sizin çıxışınız:</span>
                  </div>
                  <code className={`${styles.caseValue} ${styles.wrongOutput}`}>
                    {failedCases[0].output}
                  </code>
                </div>
                
                <div className={styles.caseRow}>
                  <div className={styles.caseLabel}>
                    <FiCheckCircle className={styles.caseIcon} />
                    <span>Gözlənilən:</span>
                  </div>
                  <code className={`${styles.caseValue} ${styles.expectedOutput}`}>
                    {failedCases[0].expected}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {isCorrect && (
        <div className={styles.successSection}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <FiCheckCircle />
            </div>
            <div className={styles.successContent}>
              <h4 className={styles.successTitle}>Mükəmməl!</h4>
              <p className={styles.successMessage}>
                Kodunuz bütün {totalCount} test halını uğurla keçdi. 
                Həlliniz düzgün və effektivdir.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actionSection}>
        {onAnalyzeComplexity && (
          <button className={styles.analyzeButton} onClick={onAnalyzeComplexity}>
            <FiClock className={styles.buttonIcon} />
            Mürəkkəblik Analizi
          </button>
        )}
      </div>
    </div>
  );
};

export default CodeEvalResult; 