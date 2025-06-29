"use client";
import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import styles from "./JsTryEditor.module.css";
import SavadliButton from "../Buttons/savadliButton/SavadliButton";
import CopyButton from "../Buttons/copyButton/CopyButton";

interface JsTryEditorProps {
  value?: string;
  onChange?: (val: string) => void;
  showRunButton?: boolean;
  showCopyButton?: boolean;
}

const defaultCode = `

function salam() {
  return 'Salam, dünya!';
}
  
salam();`;

export default function JsTryEditor({
  value,
  onChange,
  showRunButton,
  showCopyButton,
}: JsTryEditorProps) {
  const [internalCode, setInternalCode] = useState(defaultCode);
  const code = value !== undefined ? value : internalCode;
  const handleChange = (val: string | undefined) => {
    if (onChange) onChange(val ?? "");
    else setInternalCode(val ?? "");
    setOutput("");
    setError("");
    setShowOutput(false);
  };
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  const runCode = () => {
    setError("");
    let logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.map(String).join(" "));
      originalLog(...args);
    };
    try {
      // eslint-disable-next-line no-eval
      const result = eval(code);
      let outputText = logs.length > 0 ? logs.join("\n") : String(result);
      setOutput(outputText);
      setShowOutput(true);
    } catch (err: any) {
      setOutput("");
      setError(err.message);
      setShowOutput(true);
    } finally {
      console.log = originalLog;
    }
  };

  return (
    <>
      <div className={styles.editorSection}>
        <MonacoEditor
          height="300px"
          defaultLanguage="javascript"
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
            text="Kodlaşdır"
            onClick={runCode}
          />
        )}
        {showCopyButton && <CopyButton position="absolute" bottom="5px" right="160px"></CopyButton>}
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
