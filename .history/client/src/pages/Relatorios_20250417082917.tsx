import React, { useState } from 'react';
import '../styles/Relatorios.css';

// Tipos de relatórios disponíveis
const tiposRelatorios = [
  {
    id: 'resumo',
    nome: 'Resumo Geral',
    descricao: 'Visão geral de todas as atividades e métricas de qualidade',
    icone: 'fas fa-chart-line'
  },
  {
    id: 'checklist',
    nome: 'Relatório de Checklists',
    descricao: 'Dados consolidados sobre checklists e inspeções',
    icone: 'fas fa-tasks'
  },
  {
    id: 'ensaio',
    nome: 'Relatório de Ensaios',
    descricao: 'Resultados e estatísticas dos ensaios realizados',
    icone: 'fas fa-flask'
  },
  {
    id: 'nc',
    nome: 'Relatório de Não Conformidades',
    descricao: 'Análise de não conformidades e suas ações corretivas',
    icone: 'fas fa-exclamation-triangle'
  },
  {
    id: 'material',
    nome: 'Relatório de Materiais',
    descricao: 'Controlo de qualidade de materiais recebidos e utilizados',
    icone: 'fas fa-pallet'
  },
  {
    id: 'fornecedor',
    nome: 'Avaliação de Fornecedores',
    descricao: 'Análise de desempenho e qualidade dos fornecedores',
    icone: 'fas fa-truck'
  },
  {
    id: 'auditoria',
    nome: 'Relatório de Auditorias',
    descricao: 'Resultados de auditorias internas e externas',
    icone: 'fas fa-clipboard-check'
  },
  {
    id: 'personalizado',
    nome: 'Relatório Personalizado',
    descricao: 'Crie relatórios com os critérios e métricas desejados',
    icone: 'fas fa-sliders-h'
  }
];

// Projetos para filtro
const projetos = [
  { id: 1, nome: 'Obra Ferroviária Setúbal' },
  { id: 2, nome: 'Ponte Vasco da Gama - Manutenção' },
  { id: 3, nome: 'Ampliação Terminal Portuário' },
  { id: 4, nome: 'Todos os Projetos' }
];

// Componente principal de Relatórios
const Relatorios: React.FC = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
  const [projetoSelecionado, setProjetoSelecionado] = useState<number>(4); // "Todos os Projetos" como padrão
  const [periodoInicio, setPeriodoInicio] = useState<string>('');
  const [periodoFim, setPeriodoFim] = useState<string>('');
  const [formatoExportacao, setFormatoExportacao] = useState<string>('pdf');

  // Função para gerar o relatório
  const gerarRelatorio = () => {
    if (!tipoSelecionado) {
      alert('Por favor, selecione um tipo de relatório.');
      return;
    }

    console.log('Gerando relatório:', {
      tipo: tipoSelecionado,
      projeto: projetoSelecionado,
      periodoInicio,
      periodoFim,
      formato: formatoExportacao
    });

    // Aqui seria implementada a lógica para gerar o relatório
    alert('Relatório gerado com sucesso! O download começará em instantes.');
  };

  return (
    <div className="relatorios-container">
      <h1>Relatórios</h1>

      <div className="relatorios-content">
        {!tipoSelecionado ? (
          // Lista de tipos de relatórios disponíveis
          <div className="relatorios-tipos">
            <h2>Selecione o Tipo de Relatório</h2>
            <div className="tipos-grid">
              {tiposRelatorios.map(tipo => (
                <div 
                  key={tipo.id} 
                  className="tipo-card"
                  onClick={() => setTipoSelecionado(tipo.id)}
                >
                  <div className="tipo-icon">
                    <i className={tipo.icone}></i>
                  </div>
                  <div className="tipo-info">
                    <h3>{tipo.nome}</h3>
                    <p>{tipo.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Formulário de configuração do relatório
          <div className="relatorio-config">
            <div className="config-header">
              <button 
                className="btn-voltar"
                onClick={() => setTipoSelecionado(null)}
              >
                <i className="fas fa-arrow-left"></i> Voltar
              </button>
              <h2>
                <i className={tiposRelatorios.find(t => t.id === tipoSelecionado)?.icone}></i>
                {tiposRelatorios.find(t => t.id === tipoSelecionado)?.nome}
              </h2>
            </div>

            <div className="config-form">
              <div className="form-section">
                <h3>Filtros</h3>
                
                <div className="form-group">
                  <label htmlFor="projeto">Projeto</label>
                  <select 
                    id="projeto" 
                    value={projetoSelecionado}
                    onChange={e => setProjetoSelecionado(Number(e.target.value))}
                  >
                    {projetos.map(projeto => (
                      <option key={projeto.id} value={projeto.id}>
                        {projeto.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="periodoInicio">Período - Início</label>
                    <input 
                      type="date" 
                      id="periodoInicio"
                      value={periodoInicio}
                      onChange={e => setPeriodoInicio(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="periodoFim">Período - Fim</label>
                    <input 
                      type="date" 
                      id="periodoFim"
                      value={periodoFim}
                      onChange={e => setPeriodoFim(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Opções de Saída</h3>
                
                <div className="export-options">
                  <div className={`export-option ${formatoExportacao === 'pdf' ? 'selected' : ''}`} onClick={() => setFormatoExportacao('pdf')}>
                    <i className="far fa-file-pdf"></i>
                    <span>PDF</span>
                  </div>
                  <div className={`export-option ${formatoExportacao === 'excel' ? 'selected' : ''}`} onClick={() => setFormatoExportacao('excel')}>
                    <i className="far fa-file-excel"></i>
                    <span>Excel</span>
                  </div>
                  <div className={`export-option ${formatoExportacao === 'word' ? 'selected' : ''}`} onClick={() => setFormatoExportacao('word')}>
                    <i className="far fa-file-word"></i>
                    <span>Word</span>
                  </div>
                  <div className={`export-option ${formatoExportacao === 'csv' ? 'selected' : ''}`} onClick={() => setFormatoExportacao('csv')}>
                    <i className="far fa-file-csv"></i>
                    <span>CSV</span>
                  </div>
                </div>
              </div>

              {tipoSelecionado === 'personalizado' && (
                <div className="form-section">
                  <h3>Campos Personalizados</h3>
                  
                  <div className="campos-personalizados">
                    <div className="form-group">
                      <label>Selecione os Módulos</label>
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input type="checkbox" defaultChecked /> Checklists
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" defaultChecked /> Ensaios
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" defaultChecked /> Não Conformidades
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" /> Materiais
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" /> Fornecedores
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Agrupamento</label>
                      <select>
                        <option value="projeto">Por Projeto</option>
                        <option value="data">Por Data</option>
                        <option value="tipo">Por Tipo</option>
                        <option value="responsavel">Por Responsável</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button className="btn-preview">
                  <i className="fas fa-eye"></i> Pré-visualizar
                </button>
                <button className="btn-gerar" onClick={gerarRelatorio}>
                  <i className="fas fa-file-download"></i> Gerar Relatório
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Relatorios;