"use client";
import React, { useState, useEffect, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import styles from "./JsTryEditor.module.css";
import * as Babel from "@babel/standalone";
import { useI18n } from "@/contexts/I18nContext";
import { FiCopy, FiCode } from "react-icons/fi";

interface JsTryEditorProps {
  value?: string;
  onChange?: (val: string) => void;
  showRunButton?: boolean;
  showCopyButton?: boolean;
  language?: string;
  onRun?: () => void;
}

const languageSamples = {
  javascript: `function salam() {
  return 'Salam, Dünya!';
}

console.log(salam());`,
  typescript: `function salam(): string {
  return 'Salam, Dünya!';
}
  
console.log(salam());`,
  python: `def salam():
    return "Salam, Dünya!"

print(salam())`,
  python3: `def salam():
    return "Salam, Dünya!"

print(salam())`,
  cpp: `#include <iostream>

int main() {
    std::cout << "Salam, Dünya!" << std::endl;
    return 0;
}`,
  java: `public class Main {
    public static String salam() {
        return "Salam, Dünya!";
    }
    
    public static void main(String[] args) {
        System.out.println(salam());
    }
}`,
  c: `#include <stdio.h>
#include <string.h>

char* salam() {
    return "Salam, Dünya!";
}

int main() {
    printf("%s\\n", salam());
    return 0;
}`,
  csharp: `using System;

class Program {
    static string Salam() {
        return "Salam, Dünya!";
    }
    
    static void Main(string[] args) {
        Console.WriteLine(Salam());
    }
}`,
  php: `<?php
function salam() {
    return "Salam, Dünya!";
}

echo salam();
?>`,
  swift: `func salam() -> String {
    return "Salam, Dünya!"
}

print(salam())`,
  kotlin: `fun salam(): String {
    return "Salam, Dünya!"
}

fun main() {
    println(salam())
}`,
  dart: `String salam() {
  return 'Salam, Dünya!';
}
  
void main() {
  print(salam());
}`,
  go: `package main

import "fmt"

func salam() string {
    return "Salam, Dünya!"
}

func main() {
    fmt.Println(salam())
}`,
  ruby: `def salam
  "Salam, Dünya!"
end

puts salam`,
  scala: `object Main {
  def salam(): String = {
    "Salam, Dünya!"
  }
  
  def main(args: Array[String]): Unit = {
    println(salam())
  }
}`,
  rust: `fn salam() -> &'static str {
    "Salam, Dünya!"
}

fn main() {
    println!("{}", salam());
}`,
};

const defaultCode = languageSamples.javascript;

// Helper function to get file extension for each language
const getFileExtension = (language: string): string => {
  const extensions: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    python3: 'py',
    cpp: 'cpp',
    c: 'c',
    java: 'java',
    csharp: 'cs',
    php: 'php',
    swift: 'swift',
    kotlin: 'kt',
    dart: 'dart',
    go: 'go',
    ruby: 'rb',
    scala: 'scala',
    rust: 'rs',
  };
  return extensions[language] || 'txt';
};

// Fix: add index signature for string keys
const tryeditorErrorOverrides: { [key: string]: { [key: string]: string } } = {
  az: {
    tsFilenameError:
      "TypeScript transpilyasiya xətası: Bu kodun bəzi hissələri dəstəklənmir və ya sintaksis səhvidir. Zəhmət olmasa, kodunuzu yoxlayın və yalnız əsas TypeScript sintaksisindən istifadə edin.",
    tsCompileError:
      "TypeScript transpilyasiya xətası: Kodunuzda sintaksis və ya tip xətası var. Zəhmət olmasa, kodunuzu yoxlayın.",
  },
  ru: {
    tsFilenameError:
      "Ошибка транспиляции TypeScript: Некоторые части этого кода не поддерживаются или содержат синтаксическую ошибку. Пожалуйста, проверьте ваш код и используйте только базовый синтаксис TypeScript.",
    tsCompileError:
      "Ошибка транспиляции TypeScript: В вашем коде есть синтаксическая или типовая ошибка. Пожалуйста, проверьте ваш код.",
  },
  en: {
    tsFilenameError:
      "TypeScript transpilation error: Some parts of this code are not supported or contain a syntax error. Please check your code and use only basic TypeScript syntax.",
    tsCompileError:
      "TypeScript transpilation error: There is a syntax or type error in your code. Please check your code.",
  },
};

export default function JsTryEditor({
  value,
  onChange,
  showRunButton,
  showCopyButton,
  language = "typescript",
}: JsTryEditorProps) {
  const { t, lang } = useI18n();
  
  // Store code separately for each language
  const [languageCodes, setLanguageCodes] = useState<Record<string, string>>({});
  
  // Get current language code or default sample
  const getCurrentCode = () => {
    if (value !== undefined) return value;
    if (languageCodes[language]) return languageCodes[language];
    return languageSamples[language as keyof typeof languageSamples] || defaultCode;
  };
  
  const code = getCurrentCode();
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedOutput, setParsedOutput] = useState<Array<{type: string, content: string, key: string}>>([]);
  const [copied, setCopied] = useState(false);

  // Parse colored console output
  const parseColoredOutput = (logs: string[]) => {
    return logs.map((log, index) => {
      if (log.startsWith('[LOG]')) {
        return { type: 'log', content: log.substring(5), key: `log-${index}` };
      } else if (log.startsWith('[ERROR]')) {
        return { type: 'error', content: log.substring(7), key: `error-${index}` };
      } else if (log.startsWith('[WARN]')) {
        return { type: 'warn', content: log.substring(6), key: `warn-${index}` };
      } else {
        return { type: 'log', content: log, key: `log-${index}` };
      }
    });
  };
  const workerRef = useRef<Worker | null>(null);

  function tWithOverride(key: string) {
    return (
      (tryeditorErrorOverrides[lang] && tryeditorErrorOverrides[lang][key]) ||
      t(key)
    );
  }

  // Initialize code for current language when it changes
  useEffect(() => {
    if (!value && !languageCodes[language]) {
      const sampleCode = languageSamples[language as keyof typeof languageSamples] || defaultCode;
      setLanguageCodes(prev => ({ ...prev, [language]: sampleCode }));
    }
    // Reset output when language changes
    setOutput("");
    setError("");
    setShowOutput(false);
    setParsedOutput([]);
  }, [language, value, languageCodes]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const handleChange = (val: string | undefined) => {
    const newCode = val ?? "";
    if (onChange) {
      onChange(newCode);
    } else {
      setLanguageCodes(prev => ({ ...prev, [language]: newCode }));
    }
    setOutput("");
    setError("");
    setShowOutput(false);
  };

  const runCode = async (retryCount = 0) => {
    setError("");
    setOutput("");
    setShowOutput(false);
    setIsLoading(true);

    try {
      const lang = (language || "").toLowerCase();
      if (lang === "javascript" || lang === "typescript" || lang === "js") {
        try {
          let transpiled = code;

          // Handle TypeScript transpilation
          if (lang === "typescript") {
            // Check for unsupported features
            const unsupported =
              /(Promise|async\s+function|await\s|private |public |protected )/;
            if (unsupported.test(code)) {
              setError(tWithOverride("unsupportedTsFeature"));
              setShowOutput(true);
              setIsLoading(false);
              return;
            }

            // Use Babel TypeScript preset for transpilation
            try {
              transpiled =
                Babel.transform(code, {
                  presets: ["env", "typescript"],
                  filename: "file.ts",
                }).code || code;
            } catch (tsErr: unknown) {
              setError(
                tWithOverride("tsCompileError") +
                  "\n" +
                  (tsErr instanceof Error ? tsErr.message : String(tsErr))
              );
              setShowOutput(true);
              setIsLoading(false);
              return;
            }
          }

          // Use Web Worker for safe JavaScript execution
          const workerBlob = new Blob(
            [
              `
            let logs = [];
            let logCount = 0;
            const maxLogs = 50;
            let logTimer = null;
            let logDelay = 4000; // 4 seconds
            let finished = false;
            let globalTimeout = null;

            function sendLogsAndExit() {
              if (finished) return;
              finished = true;
              self.postMessage({ type: 'success', logs: logs });
              self.close();
            }

            // Override console methods to capture output with colors
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;

            function formatArgs(args) {
              return args.map(arg => {
                if (typeof arg === 'object' && arg !== null) {
                  try {
                    return JSON.stringify(arg, null, 2);
                  } catch (e) {
                    return '[Object]';
                  }
                }
                return String(arg);
              });
            }

            console.log = function(...args) {
              logCount++;
              if (logCount > maxLogs) {
                throw new Error('Too many console.log calls');
              }
              const formattedArgs = formatArgs(args);
              logs.push('[LOG]' + formattedArgs.join(' '));
              if (logTimer) clearTimeout(logTimer);
              logTimer = setTimeout(sendLogsAndExit, logDelay);
            };

            console.error = function(...args) {
              logCount++;
              if (logCount > maxLogs) {
                throw new Error('Too many console calls');
              }
              const formattedArgs = formatArgs(args);
              logs.push('[ERROR]' + formattedArgs.join(' '));
              if (logTimer) clearTimeout(logTimer);
              logTimer = setTimeout(sendLogsAndExit, logDelay);
            };

            console.warn = function(...args) {
              logCount++;
              if (logCount > maxLogs) {
                throw new Error('Too many console calls');
              }
              const formattedArgs = formatArgs(args);
              logs.push('[WARN]' + formattedArgs.join(' '));
              if (logTimer) clearTimeout(logTimer);
              logTimer = setTimeout(sendLogsAndExit, logDelay);
            };

            // Make sure setTimeout and setInterval are available in the worker
            self.setTimeout = setTimeout;
            self.setInterval = setInterval;

            // Execute the code
            try {
              ${transpiled}
              // If no async logs, still send after a short delay
              if (!logTimer) logTimer = setTimeout(sendLogsAndExit, logDelay);
              // Global fallback: always terminate after 7 seconds
              globalTimeout = setTimeout(sendLogsAndExit, 7000);
            } catch (error) {
              self.postMessage({ type: 'error', error: error instanceof Error ? error.message : String(error) });
              self.close();
            }
          `,
            ],
            { type: "application/javascript" }
          );

          const worker = new Worker(URL.createObjectURL(workerBlob));
          const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
            worker.terminate();
            setError(t("tryeditor.timeout"));
            setShowOutput(true);
            setIsLoading(false);
          }, 7000); // 7 second timeout for async

          worker.onmessage = function (e) {
            clearTimeout(timeoutId);
            if (e.data.type === "success") {
              if (e.data.logs.length === 0) {
                setOutput("");
                setParsedOutput([]);
                setError(t("tryeditor.noOutput"));
              } else {
                const parsed = parseColoredOutput(e.data.logs);
                setParsedOutput(parsed);
                setOutput(e.data.logs.join("\n")); // Keep original for backward compatibility
                setError("");
              }
              setShowOutput(true);
              setIsLoading(false);
            } else if (e.data.type === "error") {
              setError(e.data.error);
              setParsedOutput([]);
              setShowOutput(true);
              setIsLoading(false);
            }
            worker.terminate();
          };

          worker.onerror = function (e) {
            clearTimeout(timeoutId);
            setError("Worker error: " + e.message);
            setShowOutput(true);
            setIsLoading(false);
            worker.terminate();
          };

          return;
        } catch (err: unknown) {
          setError(
            t("tryeditor.jsInterpreter").replace(
              "{{message}}",
              err instanceof Error ? err.message : String(err)
            )
          );
          setShowOutput(true);
          setIsLoading(false);
        }
        return;
      }
      // Bütün backend dilləri üçün:
      const backendLangs = [
        "python",
        "python3",
        "cpp",
        "c",
        "java",
        "csharp",
        "php",
        "go",
        "rust",
      ];
      if (backendLangs.includes(lang)) {
        try {
          const timestamp = Date.now();
          const response = await fetch(`/api/execute?t=${timestamp}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, language: lang }),
            cache: "no-store",
          });
          const result = await response.json();
          if (result.error) {
            // Retry only if image loading (not file error)
            if (
              result.error.includes("Docker image yüklənir") &&
              retryCount < 2
            ) {
              setTimeout(() => runCode(retryCount + 1), 2000); // 2 saniyə sonra retry
              return;
            }
            setError(result.error);
            setOutput(result.output || "");
          } else {
            setOutput(result.output || "");
            setError(result.error || "");
          }
          setShowOutput(true);
        } catch (err: unknown) {
          setError(
            "Server error: " +
              (err instanceof Error ? err.message : String(err))
          );
          setShowOutput(true);
        } finally {
          setIsLoading(false);
        }
        return;
      }
      setError(t("tryeditor.unsupported"));
      setShowOutput(true);
      setIsLoading(false);
    } catch (err: unknown) {
      setError(
        t("tryeditor.general").replace(
          "{{message}}",
          err instanceof Error ? err.message : String(err)
        )
      );
      setShowOutput(true);
      setIsLoading(false);
    }
  };

  // Cleanup worker on unmount
  useEffect(() => {
    const worker = workerRef.current;
    return () => {
      if (worker) {
        worker.terminate();
      }
    };
  }, []);

  return (
    <>
      <div className={styles.editorSection}>
        <div className={styles.monacoWrap}>
          <MonacoEditor
            key={language}
            height="100%"
            defaultLanguage={language}
            language={language}
            value={code}
            path={`/${language}/main.${getFileExtension(language)}`}
            onChange={handleChange}
            theme="vs-dark"
            options={{
              fontSize: 15,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              padding: { top: 12, bottom: 12 },
              lineNumbersMinChars: 3,
              roundedSelection: true,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            }}
            onMount={(editor: any, monaco: any) => {
              if (language === "javascript") {
                monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
                  {
                    noSemanticValidation: true,
                    noSyntaxValidation: false,
                  }
                );
                monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
                  {
                    allowNonTsExtensions: true,
                    checkJs: false,
                    noEmit: true,
                  }
                );
              }
            }}
          />
        </div>
        {(showCopyButton || showRunButton) && (
          <div className={styles.editorToolbar}>
            {showCopyButton && (
              <button
                type="button"
                className={styles.toolbarBtnSecondary}
                onClick={() => void handleCopy()}
                aria-label={t("tryeditor.copyCode")}
              >
                <FiCopy className={styles.toolbarBtnIcon} aria-hidden />
                {t("tryeditor.copyCode")}
              </button>
            )}
            {showRunButton && (
              <button
                type="button"
                className={styles.toolbarBtnPrimary}
                onClick={() => void runCode()}
                disabled={isLoading}
                aria-busy={isLoading}
                aria-label={t("tryeditor.runCode")}
              >
                <FiCode className={styles.toolbarBtnIcon} aria-hidden />
                {isLoading ? t("tryeditor.running") : t("tryeditor.runCode")}
              </button>
            )}
          </div>
        )}
      </div>
      {copied && (
        <div className={styles.copyToast} role="status">
          {t("tryeditor.copied")}
        </div>
      )}
      {showOutput && (parsedOutput.length > 0 || output || error) && (
        <div className={styles.tryOutputBox}>
          {parsedOutput.length > 0 && (
            <div className={styles.outputSection}>
              <div className={styles.outputLabel}>{t("tryeditor.outputLabel")}</div>
              <div className={styles.coloredOutput}>
                {parsedOutput.map((logItem) => (
                  <div 
                    key={logItem.key} 
                    className={`${styles.logLine} ${styles[`log-${logItem.type}`]}`}
                  >
                    {logItem.content}
                  </div>
                ))}
              </div>
            </div>
          )}
          {!parsedOutput.length && output && (
            <div className={styles.outputSection}>
              <div className={styles.outputLabel}>{t("tryeditor.outputLabel")}</div>
              <pre className={styles.output}>{output}</pre>
            </div>
          )}
          {error && (
            <div className={styles.outputSection}>
              <pre className={styles.error}>
                {t("tryeditor.errorLabel")} {error}
              </pre>
            </div>
          )}
        </div>
      )}
    </>
  );
}
