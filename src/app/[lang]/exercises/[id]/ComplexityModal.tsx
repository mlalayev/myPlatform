import React from "react";
import { FiX } from "react-icons/fi";

interface ComplexityModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeComplexity: string | null;
}

const ComplexityModal: React.FC<ComplexityModalProps> = ({
  isOpen,
  onClose,
  timeComplexity,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '600px',
          width: '100%',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          <FiX />
        </button>
        
        <h2 style={{ marginBottom: '16px', color: '#2d3748' }}>
          Mürəkkəblik Analizi
        </h2>
        
        <div style={{ marginBottom: '16px' }}>
          <h3>Zaman Mürəkkəbliyi</h3>
          <p>{timeComplexity || "O(1)"}</p>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <h3>Yaddaş Mürəkkəbliyi</h3>
          <p>O(1)</p>
        </div>
        
        <button 
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            cursor: 'pointer'
          }}
        >
          Bağla
        </button>
      </div>
    </div>
  );
};

export default ComplexityModal; 