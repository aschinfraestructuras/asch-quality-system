import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NaoConformidades.css';

// Interface para os dados das não conformidades
interface NaoConformidadeItem {
  id: string;
  titulo: string;
  projeto: string;
  data: string;
  gravidade: string;
  estado: string;
  responsavel: string;
  prazo: string;
}

// Dados de exemplo para simulação
const dadosExemplo: NaoConformidadeItem[] = [
  {
    id: 'NC001',
    titulo: 'Desvio na espessura do betão',
    projeto: 'Obra Ferroviária Setúbal',
    data: '15/04/2025',
    gravidade: 'Alta',
    estado: 'Aberta',
    responsavel: 'João Silva',
    prazo: '30/04/2025'
  },
  {
    id: 'NC002',
    titulo: 'Falta de documentação em ensaio',
    projeto: 'Ponte Vasco da Gama - Manutenção',
    data: '14/04/2025',
    gravidade: 'Média',
    estado: 'Em tratamento',
    responsavel: 'Ana Costa',
    prazo: '28/04/2025'
  },
  {
    id: 'NC003',
    titulo: 'Não conformidade em material recebido',
    projeto: 'Ampliação Terminal Portuário',
    data: '12/04/2025',
    gravidade: 'Baixa',
    estado: 'Resolvida',
    responsavel: 'Manuel Gomes',
    prazo: '20/04/2025'
  },
  {
    id: 'NC004',
    titulo: 'Falha em procedimento de segurança',
    projeto: 'Obra Ferroviária Setúbal',
    data: '10/04/2025',
    gravidade: 'Alta',
    estado: 'Em tratamento',
    responsavel: 'Sofia Martins',
    prazo: '25/04/2025'
  },
  {
    id: 'NC005',
    titulo: 'Desvio de cronograma em fase crítica',
    projeto: 'Ponte Vasco da Gama - Manutenção',
    data: '08/04/2025',
    gravidade: 'Média',
    estado: 'Verificação',
    responsavel: 'Carlos Oliveira',
    prazo: '22/04/2025'
  }
];

const NaoConformidadesList: React.FC = () => {
  const [filtro, setFiltro] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');
  const [gravidadeFiltro, setGravidadeFiltro] = useState<string>('');

  const filtrarNaoConformidades = (): NaoConformidadeItem[] => {
    return dadosExemplo.filter(nc => {
      const matchFiltro = filtro === '' || 
        nc.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
        nc.id.toLowerCase().includes(filtro.toLowerCase()) ||
        nc.projeto.toLowerCase().includes(filtro.toLowerCase());
      
      const matchEstado = estadoFiltro === '' || nc.estado === estadoFiltro;
      const matchGravidade = gravidadeFiltro === '' || nc.gravidade === gravidadeFiltro;
      
      return matchFiltro && matchEstado && matchGravidade;
    });
  };

  const naoConformidadesFiltradas = filtrarNaoConformidades();

  return (
    <div className="nao-conformidades-list">
      <div className="list-header">
        <h2>Não Conformidades</h2>
        <Link to="nova" className="btn-nova">Nova Não Conformidade</Link>
      </div>

      <div className="filtros-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Pesquisar por ID, título ou projeto..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <button><i className="fas fa-search"></i></button>
        </div>

        <div className="filtros">
          <select 
            value={estadoFiltro} 
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="">Todos os Estados</option>
            <option value="Aberta">Aberta</option>
            <option value="Em tratamento">Em tratamento</option>
            <option value="Verificação">Verificação</option>
            <option value="Resolvida">Resolvida</option>
          </select>

          <select 
            value={gravidadeFiltro} 
            onChange={(e) => setGravidadeFiltro(e.target.value)}
          >
            <option value="">Todas as Gravidades</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>
        </div>
      </div>

      <div className="nao-conformidades-tabela">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Projeto</th>
              <th>Data</th>
              <th>Gravidade</th>
              <th>Estado</th>
              <th>Responsável</th>
              <th>Prazo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {naoConformidadesFiltradas.map(nc => (
              <tr key={nc.id} className={`gravidade-${nc.gravidade.toLowerCase()}`}>
                <td>{nc.id}</td>
                <td>{nc.titulo}</td>
                <td>{nc.projeto}</td>
                <td>{nc.data}</td>
                <td>
                  <span className={`badge gravidade-${nc.gravidade.toLowerCase()}`}>
                    {nc.gravidade}
                  </span>
                </td>
                <td>
                  <span className={`badge estado-${nc.estado.toLowerCase().replace(' ', '-')}`}>
                    {nc.estado}
                  </span>
                </td>
                <td>{nc.responsavel}</td>
                <td>{nc.prazo}</td>
                <td>
                  <div className="acoes">
                    <Link to={`/nao-conformidades/${nc.id}`} className="btn-visualizar">
                      Visualizar
                    </Link>
                    <button className="btn-editar">Editar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NaoConformidadesList;