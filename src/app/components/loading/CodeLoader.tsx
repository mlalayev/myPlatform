import React from 'react';
import styles from './CodeLoader.module.css';

const CodeLoader: React.FC = () => {
  return (
    <div className={styles.codeLoader}>
      <span>{'{'}</span><span>{'}'}</span>
    </div>
  );
};

export default CodeLoader; 