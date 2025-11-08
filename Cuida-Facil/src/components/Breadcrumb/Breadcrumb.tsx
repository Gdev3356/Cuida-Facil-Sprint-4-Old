import { Link } from 'react-router-dom';
import { useAccessibility } from '../../context/AcessibilityContext';

type BreadcrumbItem = {
  label: string;
  path?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { lerTexto, leitorAtivo, pararLeitura } = useAccessibility();

  const handleLeitura = (texto: string) => {
    if (leitorAtivo) lerTexto(texto);
  };

  return (
    <div className="unidades-breadcrumb">
      {items.map((item, index) => (
        <span key={index}>
          {item.path ? (
            <Link 
              to={item.path} 
              className="breadcrumb-link"
              onMouseEnter={() => handleLeitura(`Link: ${item.label}`)}
              onFocus={() => handleLeitura(`Link: ${item.label}`)}
              onMouseLeave={pararLeitura}
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className="breadcrumb-current"
              onMouseEnter={() => handleLeitura(`Página atual: ${item.label}`)}
              onFocus={() => handleLeitura(`Página atual: ${item.label}`)}
              onMouseLeave={pararLeitura}
              tabIndex={0}
            >
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span 
              className="breadcrumb-separator"
              aria-hidden="true"
            >
              ›
            </span>
          )}
        </span>
      ))}
    </div>
  );
}