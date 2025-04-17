import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faTasks, faFlask, faExclamationTriangle, faFileAlt, faClock, faBolt, faEdit, faTrashAlt, faPlus, faListCheck, faChartBar } from '@fortawesome/free-solid-svg-icons';
import '../styles/DashboardV2.css';

interface Resumo {
  projetos: number;
  checklists: number;
  ensaios: number;
  naoConformidades: number;
  documentos: number;
  acoesPendentes: number;
}

interface Obra {
  id: number;
  nome: string;
  status: string;
  progresso: number;
  ultimaAtualizacao: string;
}

interface Atividade {
  id: number;
  tipo: string;
  descricao: string;
  data: string;
  responsavel: string;
  projeto: string;
  estado: string;
}

const DashboardV2: React.FC = () => {
  const [resumo, setResumo] = useState<Resumo>({
    projetos: 7,
    checklists: 42,
    ensaios: 18,
    naoConformidades: 5,
    documentos: 124,
    acoesPendentes: 8
  });

  const [obras, setObras] = useState<Obra[]>([{
    id: 1,
    nome: 'Obra Ferroviária Setúbal',
    status: 'Em andamento',
    progresso: 75,
    ultimaAtualizacao: '16/04/2025'
  }, {
    id: 2,
    nome: 'Terminal Portuário - Ampliação',
    status: 'Planeado',
    progresso: 30,
    ultimaAtualizacao: '14/04/2025'
  }, {
    id: 3,
    nome: 'Manutenção Ponte Vasco da Gama',
    status: 'Em andamento',
    progresso: 60,
    ultimaAtualizacao: '12/04/2025'
  }]);

  const [atividades, setAtividades] = useState<Atividade[]>([]);

  useEffect(() => {
    setAtividades([
      {
        id: 1,
        tipo: 'ensaio',
        descricao: 'Ensaio de compressão de betão',
        data: '16/04/2025',
        responsavel: 'João Silva',
        projeto: 'Obra Ferroviária Setúbal',
        estado: 'Conforme'
      },
      {
        id: 2,
        tipo: 'checklist',
        descricao: 'Checklist de armaduras',
        data: '15/04/2025',
        responsavel: 'Ana Costa',
        projeto: 'Terminal Portuário - Ampliação',
        estado: 'Aprovado'
      },
      {
        id: 3,
        tipo: 'naoConformidade',
        descricao: 'NC: Falta de compactação',
        data: '14/04/2025',
        responsavel: 'Carlos Fernandes',
        projeto: 'Manutenção Ponte Vasco da Gama',
        estado: 'Aberta'
      }
    ]);
  }, []);

  const criarNovaObra = () => {
    alert("Funcionalidade de criação de nova obra será integrada em breve!");
  };

  return (
    <div className="dashboard-v2-container">
      <h1 className="dashboard-v2-title">Resumo Geral</h1>

      <div className="dashboard-v2-cards">
        <div className="card-v2 projetos">
          <FontAwesomeIcon icon={faBuilding} className="icon-v2" />
          <div className="info-v2">
            <span className="valor">{resumo.projetos}</span>
            <span className="label">Projetos Ativos</span>
          </div>
        </div>
        <div className="card-v2 checklists">
          <FontAwesomeIcon icon={faTasks} className="icon-v2" />
          <div className="info-v2">
            <span className="valor">{resumo.checklists}</span>
            <span className="label">Checklists (semana)</span>
          </div>
        </div>
        <div className="card-v2 ensaios">
          <FontAwesomeIcon icon={faFlask} className="icon-v2" />
          <div className="info-v2">
            <span className="valor">{resumo.ensaios}</span>
            <span className="label">Ensaios em Andamento</span>
          </div>
        </div>
        <div className="card-v2 nc">
          <FontAwesomeIcon icon={faExclamationTriangle} className="icon-v2" />
          <div className="info-v2">
            <span className="valor">{resumo.naoConformidades}</span>
            <span className="label">NC Abertas</span>
          </div>
        </div>
        <div className="card-v2 documentos">
          <FontAwesomeIcon icon={faFileAlt} className="icon-v2" />
          <div className="info-v2">
            <span className="valor">{resumo.documentos}</span>
            <span className="label">Documentos Totais</span>
          </div>
        </div>
        <div className="card-v2 pendentes">
          <FontAwesomeIcon icon={faClock} className="icon-v2" />
          <div className="info-v2">
            <span className="valor">{resumo.acoesPendentes}</span>
            <span className="label">Ações Pendentes</span>
          </div>
        </div>
      </div>

      <div className="dashboard-v2-section">
        <div className="section-header">
          <h2>Projetos em Andamento</h2>
          <div className="botoes-header">
            <a href="/projetos" className="ver-todos-link">Ver todos</a>
            <button onClick={criarNovaObra} className="nova-obra-btn">
              <FontAwesomeIcon icon={faPlus} /> Nova Obra
            </button>
          </div>
        </div>

        <div className="projetos-grid">
          {obras.map(projeto => (
            <div key={projeto.id} className="projeto-card">
              <div className="projeto-header">
                <h3>{projeto.nome}</h3>
                <span className={`status ${projeto.status.toLowerCase().replace(' ', '-')}`}>{projeto.status}</span>
              </div>

              <div className="barra-progresso">
                <div className="progresso" style={{ width: `${projeto.progresso}%` }}></div>
              </div>

              <div className="projeto-footer">
                <span className="ultima-atualizacao">Atualizado em {projeto.ultimaAtualizacao}</span>
                <div className="acoes-projeto">
                  <a href={`/projetos/${projeto.id}`} className="detalhes-link">Ver</a>
                  <button className="icon-button editar"><FontAwesomeIcon icon={faEdit} /></button>
                  <button className="icon-button eliminar"><FontAwesomeIcon icon={faTrashAlt} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-v2-section">
        <div className="section-header">
          <h2>Atividades Recentes</h2>
        </div>
        <div className="atividades-lista">
          {atividades.map((atv) => (
            <div key={atv.id} className={`atividade-item ${atv.tipo}`}>
              <div className="atividade-icone">
                {atv.tipo === 'ensaio' && <FontAwesomeIcon icon={faFlask} />}
                {atv.tipo === 'checklist' && <FontAwesomeIcon icon={faTasks} />}
                {atv.tipo === 'naoConformidade' && <FontAwesomeIcon icon={faExclamationTriangle} />}
                {atv.tipo === 'documento' && <FontAwesomeIcon icon={faFileAlt} />}
              </div>
              <div className="atividade-detalhes">
                <div className="atividade-cabecalho">
                  <span className="atividade-data">{atv.data}</span>
                  <span className="atividade-usuario">{atv.responsavel}</span>
                </div>
                <p className="atividade-descricao">{atv.descricao}</p>
                <div className="atividade-footer">
                  <span className="atividade-projeto">{atv.projeto}</span>
                  <span className="atividade-estado">{atv.estado}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardV2;
