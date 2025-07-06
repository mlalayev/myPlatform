"use client";
import React, { useState, useEffect, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import styles from "./JsTryEditor.module.css";
import SavadliButton from "../Buttons/savadliButton/SavadliButton";
import CopyButton from "../Buttons/copyButton/CopyButton";
import workerCode from "../../exercises/[id]/sandboxWorkerString";
import tryEditorWorkerCode from "./tryEditorWorkerString";
import * as Babel from '@babel/standalone';
import { useI18n } from '@/contexts/I18nContext';

interface JsTryEditorProps {
  value?: string;
  onChange?: (val: string) => void;
  showRunButton?: boolean;
  showCopyButton?: boolean;
  language?: string;
}

const languageSamples = {
  javascript: `// Modern JavaScript features including Object.assign
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// Using Object.assign
const combined = Object.assign({}, obj1, obj2);
console.log('Combined object:', combined);

// Using spread operator
const spreadCombined = { ...obj1, ...obj2 };
console.log('Spread combined:', spreadCombined);

function salam() {
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
}`
};

const defaultCode = languageSamples.javascript;

// WebAssembly runtimes
let pyodide: any = null;
let cppWasmModule: any = null;

const loadPyodide = async () => {
  if (!(window as any).loadPyodide) {
    // Dynamically load the script if not already loaded
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  if (!pyodide) {
    pyodide = await (window as any).loadPyodide();
  }
  return pyodide;
};

const loadCppWasm = async () => {
  if (!cppWasmModule) {
    // Load a pre-compiled C++ runtime using Emscripten
    const response = await fetch('/api/cpp-wasm-runtime');
    const wasmBuffer = await response.arrayBuffer();
    cppWasmModule = await WebAssembly.instantiate(wasmBuffer, {
      env: {
        memory: new WebAssembly.Memory({ initial: 256 }),
        // C++ standard library functions
        printf: (ptr: number) => {
          // Implementation for printf
          return 0;
        },
        malloc: (size: number) => {
          // Implementation for malloc
          return 0;
        },
        free: (ptr: number) => {
          // Implementation for free
        },
        // Add more C++ standard library functions as needed
      }
    });
  }
  return cppWasmModule;
};

const tryeditorErrorOverrides = {
  az: {
    tsFilenameError: 'TypeScript transpilyasiya xətası: Bu kodun bəzi hissələri dəstəklənmir və ya sintaksis səhvidir. Zəhmət olmasa, kodunuzu yoxlayın və yalnız əsas TypeScript sintaksisindən istifadə edin.',
    tsCompileError: 'TypeScript transpilyasiya xətası: Kodunuzda sintaksis və ya tip xətası var. Zəhmət olmasa, kodunuzu yoxlayın.'
  },
  ru: {
    tsFilenameError: 'Ошибка транспиляции TypeScript: Некоторые части этого кода не поддерживаются или содержат синтаксическую ошибку. Пожалуйста, проверьте ваш код и используйте только базовый синтаксис TypeScript.',
    tsCompileError: 'Ошибка транспиляции TypeScript: В вашем коде есть синтаксическая или типовая ошибка. Пожалуйста, проверьте ваш код.'
  },
  en: {
    tsFilenameError: 'TypeScript transpilation error: Some parts of this code are not supported or contain a syntax error. Please check your code and use only basic TypeScript syntax.',
    tsCompileError: 'TypeScript transpilation error: There is a syntax or type error in your code. Please check your code.'
  }
};

export default function JsTryEditor({
  value,
  onChange,
  showRunButton,
  showCopyButton,
  language = "typescript",
}: JsTryEditorProps) {
  const { t, lang } = useI18n();
  const [internalCode, setInternalCode] = useState(defaultCode);
  const code = value !== undefined ? value : internalCode;
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  
  function tWithOverride(key: string) {
    return (tryeditorErrorOverrides[lang] && tryeditorErrorOverrides[lang][key]) || t(key);
  }

  // Update sample code when language changes
  useEffect(() => {
    if (!value && languageSamples[language as keyof typeof languageSamples]) {
      setInternalCode(languageSamples[language as keyof typeof languageSamples]);
    }
  }, [language, value]);

  const handleChange = (val: string | undefined) => {
    if (onChange) onChange(val ?? "");
    else setInternalCode(val ?? "");
    setOutput("");
    setError("");
    setShowOutput(false);
  };

  const runCode = async () => {
    setError("");
    setOutput("");
    setShowOutput(false);
    setIsLoading(true);

    try {
      const lang = (language || '').toLowerCase();
      if (lang === "javascript" || lang === "typescript" || lang === "js") {
        try {
          let transpiled = code;
          
          // Handle TypeScript transpilation
          if (lang === 'typescript') {
            // Check for unsupported features
            const unsupported = /(Promise|async\s+function|await\s|private |public |protected )/;
            if (unsupported.test(code)) {
              setError(tWithOverride('unsupportedTsFeature'));
              setShowOutput(true);
              setIsLoading(false);
              return;
            }
            
            // Use Babel TypeScript preset for transpilation
            try {
              transpiled = Babel.transform(code, { 
                presets: ['env', 'typescript'], 
                filename: 'file.ts' 
              }).code || code;
            } catch (tsErr: any) {
              setError(tWithOverride('tsCompileError') + '\n' + (tsErr.message || tsErr));
              setShowOutput(true);
              setIsLoading(false);
              return;
            }
          }

          // Use Web Worker for safe JavaScript execution
          const workerBlob = new Blob([`
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

            // Override console.log to capture output with better object formatting
            const originalLog = console.log;
            console.log = function(...args) {
              logCount++;
              if (logCount > maxLogs) {
                throw new Error('Too many console.log calls');
              }
              const formattedArgs = args.map(arg => {
                if (typeof arg === 'object' && arg !== null) {
                  try {
                    return JSON.stringify(arg, null, 2);
                  } catch (e) {
                    return '[Object]';
                  }
                }
                return String(arg);
              });
              logs.push(formattedArgs.join(' '));
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
              self.postMessage({ type: 'error', error: error.message });
              self.close();
            }
          `], { type: 'application/javascript' });

          const worker = new Worker(URL.createObjectURL(workerBlob));

          let timeoutId;

          worker.onmessage = function(e) {
            clearTimeout(timeoutId);
            if (e.data.type === 'success') {
              if (e.data.logs.length === 0) {
                setOutput("");
                setError(t('tryeditor.noOutput'));
              } else {
                setOutput(e.data.logs.join("\n"));
                setError("");
              }
              setShowOutput(true);
              setIsLoading(false);
            } else if (e.data.type === 'error') {
              setError(e.data.error);
              setShowOutput(true);
              setIsLoading(false);
            }
            worker.terminate();
          };

          worker.onerror = function(e) {
            clearTimeout(timeoutId);
            setError('Worker error: ' + e.message);
            setShowOutput(true);
            setIsLoading(false);
            worker.terminate();
          };

          // Set a timeout for the worker
          timeoutId = setTimeout(() => {
            worker.terminate();
            setError(t('tryeditor.timeout'));
            setShowOutput(true);
            setIsLoading(false);
          }, 7000); // 7 second timeout for async
          
          return;
        } catch (err: any) {
          setError(t('tryeditor.jsInterpreter').replace('{{message}}', err.message));
          setShowOutput(true);
          setIsLoading(false);
        }
        return;
      }
      if (lang === "python" || lang === "python3") {
        try {
          const response = await fetch('/api/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, language: lang }),
          });
          const result = await response.json();
          if (result.error) {
            setError(result.error);
            setOutput(result.output || "");
          } else {
            setOutput(result.output || "");
            setError(result.error || "");
          }
          setShowOutput(true);
        } catch (err: any) {
          setError("Server error: " + err.message);
          setShowOutput(true);
        } finally {
          setIsLoading(false);
        }
        return;
      }
      if (lang === "cpp") {
        try {
          const response = await fetch('/api/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, language: lang }),
          });
          const result = await response.json();
          if (result.error) {
            setError(result.error);
            setOutput(result.output || "");
          } else {
            setOutput(result.output || "");
            setError(result.error || "");
          }
          setShowOutput(true);
        } catch (err: any) {
          setError("Server error: " + err.message);
          setShowOutput(true);
        } finally {
          setIsLoading(false);
        }
        return;
      }
      setError(t('tryeditor.unsupported'));
      setShowOutput(true);
      setIsLoading(false);
    } catch (err: any) {
      setError(t('tryeditor.general').replace('{{message}}', err.message));
      setShowOutput(true);
      setIsLoading(false);
    }
  };

  // Cleanup worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
    }
  };
  }, []);

  return (
    <>
      <div className={styles.editorSection}>
        <MonacoEditor
          key={language} // Force re-render when language changes
          height="300px"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={handleChange}
          theme="vs-dark"
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
          onMount={(editor, monaco) => {
            if (language === "javascript") {
              monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true,
                noSyntaxValidation: false,
              });
              monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                allowNonTsExtensions: true,
                checkJs: false,
                noEmit: true,
              });
            }
          }}
        />
        {showRunButton && (
          <SavadliButton
            position="absolute"
            bottom="5px"
            right="10px"
            text={isLoading ? "Çalışır..." : "Kodlaşdır"}
            onClick={runCode}
            disabled={isLoading}
          />
        )}
        {showCopyButton && <CopyButton position="absolute" bottom="5px" right="160px" text={code}></CopyButton>}
      </div>
      {showOutput && (output || error) && (
        <div className={styles.tryOutputBox}>
          {output && (
            <div className={styles.outputSection}>
              <div className={styles.outputLabel}>Nəticə:</div>
              <pre className={styles.output}>{output}</pre>
            </div>
          )}
          {error && (
            <div className={styles.outputSection}>
              <pre className={styles.error}>{t('tryeditor.errorLabel')} {error}</pre>
            </div>
          )}
        </div>
      )}
    </>
  );
}
