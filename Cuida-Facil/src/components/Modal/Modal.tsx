import React from 'react';

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
    // Impede que o clique dentro do modal o feche
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div 
            onClick={onClose} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        >
            <div 
                onClick={handleContentClick}
                className="relative bg-white rounded-lg shadow-xl"
            >
                <button 
                    onClick={onClose} 
                    className="absolute -top-3 -right-3 z-10 p-1 bg-white rounded-full text-black"
                    aria-label="Fechar modal"
                >
                    &#x2715;
                </button>
                
                {children}
            </div>
        </div>
    );
}