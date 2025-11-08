import { useState } from 'react';
import { 
  Accessibility, 
  Sun, 
  Moon, 
  Contrast, 
  Type, 
  Volume2, 
  VolumeX,
  X,
  RotateCcw
} from 'lucide-react';
import { useAccessibility } from '../../context/AcessibilityContext';

export default function PainelAcessibilidade() {
  const [aberto, setAberto] = useState(false);
  const {
    tema,
    contraste,
    tamanhoFonte,
    leitorAtivo,
    alternarTema,
    alternarContraste,
    alternarTamanhoFonte,
    alternarLeitor,
    lerTexto,
    resetarConfiguracoes,
  } = useAccessibility();

  const handleAbrirPainel = () => {
    setAberto(true);
    lerTexto('Painel de acessibilidade aberto');
  };

  const handleFecharPainel = () => {
    setAberto(false);
    lerTexto('Painel de acessibilidade fechado');
  };

  const handleAlternarTema = () => {
    alternarTema();
    const novoTema = tema === 'claro' ? 'escuro' : 'claro';
    lerTexto(`Modo ${novoTema} ativado`);
  };

  const handleAlternarContraste = () => {
    alternarContraste();
    const proximoContraste = contraste === 'normal' ? 'alto' : contraste === 'alto' ? 'muito alto' : 'normal';
    lerTexto(`Contraste ${proximoContraste} ativado`);
  };

  const handleAlternarTamanhoFonte = () => {
    alternarTamanhoFonte();
    const proximoTamanho = tamanhoFonte === 'normal' ? 'grande' : tamanhoFonte === 'grande' ? 'muito grande' : 'normal';
    lerTexto(`Tamanho de fonte ${proximoTamanho} ativado`);
  };

  const handleAlternarLeitor = () => {
    alternarLeitor();
    const novoEstado = !leitorAtivo ? 'ativado' : 'desativado';
    lerTexto(`Leitor de tela ${novoEstado}`);
  };

  const handleResetar = () => {
    resetarConfiguracoes();
    lerTexto('Configurações de acessibilidade resetadas');
  };

  const obterLabelContraste = () => {
    if (contraste === 'normal') return 'Normal';
    if (contraste === 'alto') return 'Alto';
    return 'Muito Alto';
  };

  const obterLabelTamanhoFonte = () => {
    if (tamanhoFonte === 'normal') return 'Normal';
    if (tamanhoFonte === 'grande') return 'Grande';
    return 'Muito Grande';
  };

  return (
    <>
      {/* Botão flutuante */}
      {!aberto && (
        <button
          onClick={handleAbrirPainel}
          className="accessibility-fab"
          aria-label="Abrir painel de acessibilidade"
          title="Acessibilidade"
        >
          <Accessibility size={28} />
        </button>
      )}

      {/* Painel lateral */}
      {aberto && (
        <>
          {/* Overlay */}
          <div 
            className="accessibility-overlay"
            onClick={handleFecharPainel}
          />

          {/* Painel */}
          <div className="accessibility-panel">
            {/* Header */}
            <div className="accessibility-panel-header">
              <h2 className="accessibility-panel-title">
                <Accessibility size={24} />
                Acessibilidade
              </h2>
              <button
                onClick={handleFecharPainel}
                className="accessibility-close"
                aria-label="Fechar painel"
              >
                <X size={24} />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="accessibility-panel-content">
              {/* Modo Escuro */}
              <div className="accessibility-option">
                <div className="accessibility-option-info">
                  {tema === 'claro' ? <Sun size={20} /> : <Moon size={20} />}
                  <div>
                    <h3 className="accessibility-option-title">Modo Escuro</h3>
                    <p className="accessibility-option-description">
                      Reduz o brilho da tela
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAlternarTema}
                  className={`accessibility-toggle ${tema === 'escuro' ? 'active' : ''}`}
                  aria-label={`Modo ${tema === 'claro' ? 'escuro' : 'claro'}`}
                >
                  <span className="accessibility-toggle-slider" />
                </button>
              </div>

              {/* Contraste */}
              <div className="accessibility-option">
                <div className="accessibility-option-info">
                  <Contrast size={20} />
                  <div>
                    <h3 className="accessibility-option-title">Contraste</h3>
                    <p className="accessibility-option-description">
                      {obterLabelContraste()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAlternarContraste}
                  className="accessibility-button-cycle"
                  aria-label="Alternar contraste"
                >
                  Ajustar
                </button>
              </div>

              {/* Tamanho da Fonte */}
              <div className="accessibility-option">
                <div className="accessibility-option-info">
                  <Type size={20} />
                  <div>
                    <h3 className="accessibility-option-title">Tamanho do Texto</h3>
                    <p className="accessibility-option-description">
                      {obterLabelTamanhoFonte()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAlternarTamanhoFonte}
                  className="accessibility-button-cycle"
                  aria-label="Alternar tamanho da fonte"
                >
                  Ajustar
                </button>
              </div>

              {/* Leitor de Tela */}
              <div className="accessibility-option">
                <div className="accessibility-option-info">
                  {leitorAtivo ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  <div>
                    <h3 className="accessibility-option-title">Leitor de Tela</h3>
                    <p className="accessibility-option-description">
                      Lê textos em voz alta
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAlternarLeitor}
                  className={`accessibility-toggle ${leitorAtivo ? 'active' : ''}`}
                  aria-label={`Leitor de tela ${leitorAtivo ? 'ativado' : 'desativado'}`}
                >
                  <span className="accessibility-toggle-slider" />
                </button>
              </div>

              {/* Resetar */}
              <div className="accessibility-reset">
                <button
                  onClick={handleResetar}
                  className="accessibility-button-reset"
                  aria-label="Resetar configurações"
                >
                  <RotateCcw size={18} />
                  Resetar Configurações
                </button>
              </div>

              {/* Informações */}
              <div className="accessibility-info">
                <p>
                  <strong>Dica:</strong> Use o leitor de tela passando o mouse sobre textos importantes.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}