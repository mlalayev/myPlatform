"use client";
import React, { useState, useEffect, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import styles from "./JsTryEditor.module.css";
import SavadliButton from "../Buttons/savadliButton/SavadliButton";
import CopyButton from "../Buttons/copyButton/CopyButton";
import workerCode from "../../exercises/[id]/sandboxWorkerString";
import tryEditorWorkerCode from "./tryEditorWorkerString";
import Interpreter from 'js-interpreter';

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
      if (language === "javascript" || language === "typescript") {
        try {
          let logs: string[] = [];
          const myInterpreter = new Interpreter(code, function(interpreter, globalObject) {
            const wrapper = function(...args: any[]) {
              logs.push(args.map(String).join(" "));
            };
            const consoleObj = interpreter.nativeToPseudo({ log: wrapper });
            interpreter.setProperty(globalObject, 'console', consoleObj);
          });

          let steps = 0;
          const maxSteps = 100000; // Adjust as needed
          const stepBatch = 1000; // Steps per batch
          let finished = false;

          function stepLoop() {
            let batchSteps = 0;
            while (myInterpreter.step()) {
              steps++;
              batchSteps++;
              if (steps > maxSteps) {
                setError("Kod icrası çox uzun çəkdi və dayandırıldı.");
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
            if (!finished) {
              setOutput(logs.join("\n"));
              setShowOutput(true);
              setIsLoading(false);
            }
          }

          stepLoop();
          return;
        } catch (err: any) {
          setError("JS-Interpreter error: " + err.message);
          setShowOutput(true);
          setIsLoading(false);
        }
      }
      if (language === "python" || language === "python3") {
        try {
          setOutput("Pyodide yüklənir...");
          const pyodideInstance = await loadPyodide();
          setOutput("");
          const result = await pyodideInstance.runPythonAsync(code);
          setOutput(String(result));
          setShowOutput(true);
        } catch (err: any) {
          setError("Pyodide və ya Python kodunda xəta: " + err.message);
          setShowOutput(true);
        } finally {
          setIsLoading(false);
        }
        return;
      }
      setError(`Bu dil üçün icra dəstəklənmir.`);
      setShowOutput(true);
      setIsLoading(false);
    } catch (err: any) {
      setError('İcra xətası: ' + err.message);
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
              <pre className={styles.error}>Xəta: {error}</pre>
            </div>
          )}
        </div>
      )}
    </>
  );
}
