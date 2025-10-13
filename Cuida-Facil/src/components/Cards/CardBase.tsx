import type { ReactNode } from "react";

type CardBaseProps = {
    children: ReactNode;
    cssClass: string;
    onClick?: () => void;
    clickable?: boolean;
}

export default function CardBase({ children, cssClass, onClick, clickable = false }: CardBaseProps) {
    return (
        <div 
            className={`card ${cssClass}`}
            onClick={onClick}
            style={{ cursor: clickable ? 'pointer' : 'default' }}
        >
            {children}
        </div>
    );
}