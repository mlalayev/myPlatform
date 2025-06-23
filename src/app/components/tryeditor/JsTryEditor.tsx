"use client"
import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import styles from './JsTryEditor.module.css';

interface JsTryEditorProps {
  value?: string;
  onChange?: (val: string) => void;
}

const defaultCode = `function salam() {
  return 'Salam, dünya!';
}
salam();`;

export default function JsTryEditor({ value, onChange }: JsTryEditorProps) {
  const [internalCode, setInternalCode] = useState(defaultCode);
  const code = value !== undefined ? value : internalCode;
  const handleChange = (val: string) => {
    if (onChange) onChange(val);
    else setInternalCode(val);
  };
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // The runCode logic is not used in controlled mode, so we keep it for demo only
  const runCode = () => {
    setError('');
    try {
      // eslint-disable-next-line no-eval
      const result = eval(code);
      setOutput(String(result));
    } catch (err: any) {
      setOutput('');
      setError(err.message);
    }
  };

  return (
    <div className={styles.editorContainer}>
      <Editor
        value={code}
        onValueChange={handleChange}
        highlight={(code: string) => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
        padding={16}
        className={styles.editor}
        style={{ fontFamily: 'HelveticaNeue-Medium, Helvetica Neue, Arial, sans-serif', fontSize: 16 }}
      />
      {/* Demo run button, not used in main exercise page */}
      {/* <button className={styles.runButton} onClick={runCode}>İcra et</button> */}
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
  );
} 