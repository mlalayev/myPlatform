"use client";
import React, { useState, useEffect, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import styles from "./JsTryEditor.module.css";
import SavadliButton from "../Buttons/savadliButton/SavadliButton";
import CopyButton from "../Buttons/copyButton/CopyButton";
import workerCode from "../../exercises/[id]/sandboxWorkerString";
import tryEditorWorkerCode from "./tryEditorWorkerString";
import Interpreter from 'js-interpreter';
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
#include <string>

std::string salam() {
    return "Salam, Dünya!";
}

int main() {
    std::cout << salam() << std::endl;
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

export default function JsTryEditor({
  value,
  onChange,
  showRunButton,
  showCopyButton,
  language = "typescript",
}: JsTryEditorProps) {
  const { t } = useI18n();
  const [internalCode, setInternalCode] = useState(defaultCode);
  const code = value !== undefined ? value : internalCode;
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  
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
          let logs: string[] = [];
          let logCount = 0;
          const maxLogs = 5;
          let stoppedForLogs = false;
          let transpiled = code;
          try {
            transpiled = Babel.transform(code, { presets: ['env'] }).code || code;
          } catch (babelErr: any) {
            setError(t('tryeditor.babel').replace('{{message}}', babelErr.message));
            setShowOutput(true);
            setIsLoading(false);
            return;
          }
          const myInterpreter = new Interpreter(transpiled, function(interpreter, globalObject) {
            const wrapper = function(...args: any[]) {
              logCount++;
              if (logCount > maxLogs) {
                stoppedForLogs = true;
                throw new Error(t('tryeditor.tooManyLogs'));
              }
              logs.push(args.map(String).join(" "));
            };
            const consoleObj = interpreter.nativeToPseudo({ log: wrapper });
            interpreter.setProperty(globalObject, 'console', consoleObj);
          });

          let steps = 0;
          const maxSteps = 100000; // Adjust as needed
          const stepBatch = 1000; // Steps per batch
          let finished = false;
          setIsLoading(true);

          function stepLoop() {
            let batchSteps = 0;
            try {
              while (myInterpreter.step()) {
                steps++;
                batchSteps++;
                if (steps > maxSteps) {
                  setError(t('tryeditor.timeout'));
                  setShowOutput(true);
                  setIsLoading(false);
                  finished = true;
                  return;
                }
                if (batchSteps >= stepBatch) {
                  setTimeout(stepLoop, 0);
                  return;
                }
              }
            } catch (err: any) {
              if (stoppedForLogs) {
                setError(t('tryeditor.tooManyLogs'));
              } else {
                setError(t('tryeditor.jsInterpreter').replace('{{message}}', err.message));
              }
              setShowOutput(true);
              setIsLoading(false);
              finished = true;
              return;
            }
            if (!finished) {
              if (logs.length === 0) {
                setOutput("");
                setError(t('tryeditor.noOutput'));
              } else {
                setOutput(logs.join("\n"));
                setError("");
              }
              setShowOutput(true);
              setIsLoading(false);
            }
          }

          stepLoop();
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
