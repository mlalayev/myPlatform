// Required packages: npm install react-simple-code-editor prismjs
// For types: npm install --save-dev @types/react-simple-code-editor
import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import styles from './JsTryEditor.module.css';

const defaultCode = `function salam() {
  return 'Salam, dünya!';
}
salam();`;

export default function JsTryEditor() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

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
        onValueChange={setCode}
        highlight={(code: string) => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
        padding={16}
        className={styles.editor}
        style={{ fontFamily: 'HelveticaNeue-Medium, Helvetica Neue, Arial, sans-serif', fontSize: 16 }}
      />
      <button className={styles.runButton} onClick={runCode}>İcra et</button>
      <div className={styles.outputSection}>
        <div className={styles.outputLabel}>Nəticə:</div>
        <pre className={styles.output}>{output}</pre>
        {error && <pre className={styles.error}>Xəta: {error}</pre>}
      </div>
    </div>
  );
} 