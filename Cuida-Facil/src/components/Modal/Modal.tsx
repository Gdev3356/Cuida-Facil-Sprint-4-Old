// components/Modal/modal.tsx
import type { ReactNode } from 'react'
import {useEffect } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    document.body.classList.add('modal-open');
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button 
          className="modal-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}