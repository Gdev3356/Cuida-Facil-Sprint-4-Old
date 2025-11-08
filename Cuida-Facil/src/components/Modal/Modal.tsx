// components/Modal/Modal.tsx
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react';
import { useAccessibility } from '../../context/AcessibilityContext';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  const { lerTexto, pararLeitura } = useAccessibility();
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add('modal-open');
    
    // Foca e lê o conteúdo do modal ao abrir
    if (modalContentRef.current) {
        modalContentRef.current.focus();
        lerTexto("Modal aberto. Pressione a tecla ESC ou clique no botão fechar para sair.");
    }
    
    return () => {
      document.body.classList.remove('modal-open');
      pararLeitura();
    };
  }, [lerTexto, pararLeitura]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseButtonLeitura = () => {
    lerTexto("Botão Fechar Modal");
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div 
        className="modal-content"
        ref={modalContentRef}
        tabIndex={-1} 
        role="dialog" 
        aria-modal="true"
      >
        <button 
          className="modal-close"
          onClick={onClose}
          aria-label="Fechar"
          onMouseEnter={handleCloseButtonLeitura}
          onFocus={handleCloseButtonLeitura}
          onMouseLeave={pararLeitura}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}