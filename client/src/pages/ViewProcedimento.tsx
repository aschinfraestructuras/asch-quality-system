import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faEdit, faDownload, faHistory, faCopy,
  faExternalLinkAlt, faClipboardCheck, faCheckCircle, faTimesCircle,
  faExclamationTriangle, faCalendarAlt, faUserAlt, faBuilding,
  faFileAlt, faPaperclip, faInfoCircle, faSpinner, faCog, 
  faListOl, faBook, faTable, faEye
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Documentos.css';

// Tipo para Procedimento
interface Procedimento {
  id: number;
  codigo: string;
  titulo: string;
  categoria: string;
  departamento: string;
  data_criacao: string;
  data_atualizacao: string;
  status: string;
  version: string;
  author: string;
  description?: string;
  conteudo?: {
    objetivo: string;
    escopo: string;
    referencias: string[];
    definicoes: {termo: string, definicao: string}[];
    responsabilidades: {cargo: string, responsabilidades: string[]}[];
    procedimento: string;
    registos: {nome: string, codigo: string, retencao: string}[];
    anexos: {nome: string, descricao: string}[];
  };
  historico_versoes?: {
    versao: string;
    data: string;
    autor: string;
    alteracoes: string;
  }[];
}

const ViewProcedimento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [procedimento, setProcedimento] = useState<Procedimento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [secaoAtiva, setSecaoAtiva] = useState('sumario');
  
  // Simulação de carregamento do Procedimento
  useEffect(() => {
    const fetchProcedimento = async () => {
      setCarregando(true);
      
      try {
        // Em um cenário real, isto seria uma chamada API
        // Simulando tempo de carregamento
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock de dados
        if (id) {
          const procedimentoMock: Procedimento = {
            id: parseInt(id),
            codigo: 'PROC-QUA-001',
            titulo: 'Controlo de Qualidade de Betão',
            categoria: 'Qualidade',
            departamento: 'Controlo de Qualidade',
            data_criacao: '2024-09-15',
            data_atualizacao: '2025-01-20',
            status: 'ativo',
            version: 'v2.1',
            author: 'António Costa',
            description: 'Procedimento para controlo de qualidade de betão em obra',
            conteudo: {
              objetivo: 'Estabelecer os procedimentos para controlo de qualidade do betão em obra, desde a receção até à sua aplicação, de modo a garantir a conformidade com as especificações do projeto e normas aplicáveis.',
              escopo: 'Este procedimento aplica-se a todas as atividades de controlo de qualidade do betão nas obras da empresa, incluindo betão pronto e betão produzido em obra.',
              referencias: [
                'NP EN 206-1: Betão - Especificação, desempenho, produção e conformidade',
                'NP EN 12350: Ensaios do betão fresco',
                'NP EN 12390: Ensaios do betão endurecido',
                'LNEC E464: Metodologia para estimar as propriedades de desempenho do betão'
              ],
              definicoes: [
                {termo: 'Betão', definicao: 'Material formado pela mistura de cimento, agregados grossos e finos e água, com ou sem a incorporação de adjuvantes, adições ou fibras.'},
                {termo: 'Slump', definicao: 'Ensaio de abaixamento do cone de Abrams, que mede a consistência do betão fresco.'},
                {termo: 'Resistência característica', definicao: 'Valor da resistência à compressão, abaixo do qual se prevê que ocorram 5% de todos os resultados possíveis de ensaios da população de betão considerada.'}
              ],
              responsabilidades: [
                {cargo: 'Diretor de Obra', responsabilidades: ['Garantir os recursos necessários para a implementação deste procedimento', 'Aprovar o plano de amostragem do betão']},
                {cargo: 'Responsável pela Qualidade', responsabilidades: ['Elaborar o plano de amostragem', 'Verificar a conformidade com as especificações', 'Elaborar e aprovar relatórios de ensaio']},
                {cargo: 'Técnico de Laboratório', responsabilidades: ['Realizar os ensaios conforme as normas', 'Preencher os registos dos ensaios', 'Comunicar imediatamente qualquer não conformidade']}
              ],
              procedimento: 'O controlo de qualidade do betão deve seguir as seguintes etapas:\n\n1. Verificação da guia de remessa do betão\n   - Confirmar classe de resistência, consistência, exposição ambiental, dimensão máxima do agregado\n   - Verificar tempo de transporte e volume fornecido\n\n2. Inspeção visual do betão\n   - Verificar homogeneidade, segregação, exsudação\n\n3. Ensaios do betão fresco\n   - Realizar ensaio de abaixamento (slump) segundo a NP EN 12350-2\n   - Medir temperatura ambiente e do betão\n   - Recolher amostras para ensaios de resistência à compressão\n\n4. Moldagem de provetes\n   - Moldar cubos de 150mm segundo a NP EN 12390-2\n   - Identificar devidamente os provetes\n   - Manter os provetes protegidos e em condições adequadas até ao transporte para laboratório\n\n5. Ensaios de resistência à compressão\n   - Realizar ensaios aos 7 e 28 dias\n   - Comparar resultados com os requisitos do projeto\n\n6. Ações em caso de não conformidade\n   - Informar imediatamente o fornecedor e o Diretor de Obra\n   - Avaliar a extensão da não conformidade\n   - Decidir sobre aceitação, rejeição ou realização de ensaios complementares',
              registos: [
                {nome: 'Ficha de Receção de Betão', codigo: 'FRB-001', retencao: '5 anos'},
                {nome: 'Registo de Ensaio de Abaixamento', codigo: 'REA-002', retencao: '5 anos'},
                {nome: 'Registo de Moldagem de Provetes', codigo: 'RMP-003', retencao: '5 anos'},
                {nome: 'Relatório de Ensaio de Compressão', codigo: 'REC-004', retencao: '10 anos'}
              ],
              anexos: [
                {nome: 'Anexo A', descricao: 'Fluxograma do processo de controlo de qualidade do betão'},
                {nome: 'Anexo B', descricao: 'Modelo de Ficha de Receção de Betão'},
                {nome: 'Anexo C', descricao: 'Modelo de Registo de Ensaio de Abaixamento'},
                {nome: 'Anexo D', descricao: 'Modelo de Registo de Moldagem de Provetes'}
              ]
            },
            historico_versoes: [
              {
                versao: 'v2.1',
                data: '2025-01-20',
                autor: 'António Costa',
                alteracoes: 'Atualização das referências normativas e ajustes no procedimento de moldagem de provetes.'
              },
              {
                versao: 'v2.0',
                data: '2024-11-12',
                autor: 'António Costa',
                alteracoes: 'Revisão completa do procedimento para incluir novas classes de exposição ambiental conforme atualização normativa.'
              },
              {
                versao: 'v1.2',
                data: '2024-04-05',
                autor: 'Sofia Rodrigues',
                alteracoes: 'Adicionados novos formulários de registo nos anexos.'
              },
              {
                versao: 'v1.1',
                data: '2023-10-18',
                autor: 'Sofia Rodrigues',
                alteracoes: 'Correções e melhorias no texto do procedimento.'
              },
              {
                versao: 'v1.0',
                data: '2023-08-22',
                autor: 'Carlos Oliveira',
                alteracoes: 'Versão inicial do procedimento.'
              }
            ]
          };
          
          setProcedimento(procedimentoMock);
          setCarregando(false);
        } else {
          throw new Error('ID do procedimento não fornecido');
        }
      } catch (error) {
        console.error('Erro ao carregar procedimento:', error);
        setErro('Não foi possível carregar os detalhes do procedimento. Por favor, tente novamente.');
        setCarregando(false);
      }
    };
    
    fetchProcedimento();
  }, [id]);
  
  // Componente de estado do Procedimento
  const StatusBadge = ({ status }: { status: string }) => {
    let badgeClass = '';
    let icon;
    let texto = '';
    
    switch (status) {
      case 'ativo':
        badgeClass = 'status-ativo';
        icon = faCheckCircle;
        texto = 'Ativo';
        break;
      case 'em_revisao':
        badgeClass = 'status-em-revisao';
        icon = faSpinner;
        texto = 'Em Revisão';
        break;
      case 'em_aprovacao':
        badgeClass = 'status-em-aprovacao';
        icon = faExclamationTriangle;
        texto = 'Em Aprovação';
        break;
      case 'obsoleto':
        badgeClass = 'status-obsoleto';
        icon = faTimesCircle;
        texto = 'Obsoleto';
        break;
      default:
        badgeClass = 'status-ativo';
        icon = faCheckCircle;
        texto = 'Ativo';
    }
    
    return (
      <span className={`badge ${badgeClass}`}>
        <FontAwesomeIcon icon={icon} className="mr-1" />
        {texto}
      </span>
    );
  };
  
  // Componente de Carregamento
  const Carregando = () => (
    <div className="estado-carregando">
      <div className="spinner"></div>
      <p>A carregar detalhes do procedimento...</p>
    </div>
  );
  
  // Componente de Erro
  const Erro = () => (
    <div className="estado-erro">
      <FontAwesomeIcon icon={faTimesCircle} size="3x" />
      <h3>Erro ao carregar procedimento</h3>
      <p>{erro}</p>
      <button className="btn-secundario" onClick={() => navigate('/documentos/procedimentos')}>
        <FontAwesomeIcon icon={faArrowLeft} /> Voltar para a Lista
      </button>
    </div>
  );
  
  if (carregando) {
    return <Carregando />;
  }
  
  if (erro || !procedimento) {
    return <Erro />;
  }
  
  return (
    <div className="procedimento-view-container">
      {/* Cabeçalho */}
      <div className="procedimento-header">
        <div className="procedimento-header-info">
          <div className="caminho-navegacao">
            <Link to="/documentos/procedimentos" className="link-navegacao">
              <FontAwesomeIcon icon={faArrowLeft} /> Voltar para lista
            </Link>
          </div>
          
          <div className="procedimento-titulo">
            <div className="titulo-principal">
              <h1>
                <FontAwesomeIcon icon={faClipboardCheck} /> 
                <span className="codigo-badge">{procedimento.codigo}</span>
              </h1>
              <StatusBadge status={procedimento.status} />
              <span className="versao-badge">{procedimento.version}</span>
            </div>
            <h2>{procedimento.titulo}</h2>
          </div>
          
          <div className="procedimento-meta">
            <div className="meta-item">
              <FontAwesomeIcon icon={faCalendarAlt} className="meta-icon" />
              <div className="meta-texto">
                <span className="meta-label">Última Atualização</span>
                <span className="meta-valor">{new Date(procedimento.data_atualizacao).toLocaleDateString('pt-PT')}</span>
              </div>
            </div>
            
            <div className="meta-item">
              <FontAwesomeIcon icon={faUserAlt} className="meta-icon" />
              <div className="meta-texto">
                <span className="meta-label">Autor</span>
                <span className="meta-valor">{procedimento.author}</span>
              </div>
            </div>
            
            <div className="meta-item">
              <FontAwesomeIcon icon={faBuilding} className="meta-icon" />
              <div className="meta-texto">
                <span className="meta-label">Departamento</span>
                <span className="meta-valor">{procedimento.departamento}</span>
              </div>
            </div>
            
            <div className="meta-item">
              <FontAwesomeIcon icon={faFileAlt} className="meta-icon" />
              <div className="meta-texto">
                <span className="meta-label">Categoria</span>
                <span className="meta-valor">{procedimento.categoria}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="procedimento-header-acoes">
          <button className="btn-primario">
            <FontAwesomeIcon icon={faDownload} /> PDF
          </button>
          <button className="btn-secundario">
            <FontAwesomeIcon icon={faEdit} /> Editar
          </button>
          <button className="btn-secundario">
            <FontAwesomeIcon icon={faCopy} /> Duplicar
          </button>
          <div className="btn-mais-opcoes">
            <button className="btn-icone">
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Navegação por tabs */}
      <div className="procedimento-navegacao">
        <button 
          className={`nav-item ${secaoAtiva === 'sumario' ? 'ativo' : ''}`}
          onClick={() => setSecaoAtiva('sumario')}
        >
          <FontAwesomeIcon icon={faInfoCircle} /> Sumário
        </button>
        <button 
          className={`nav-item ${secaoAtiva === 'procedimento' ? 'ativo' : ''}`}
          onClick={() => setSecaoAtiva('procedimento')}
        >
          <FontAwesomeIcon icon={faListOl} /> Procedimento
        </button>
        <button 
          className={`nav-item ${secaoAtiva === 'responsabilidades' ? 'ativo' : ''}`}
          onClick={() => setSecaoAtiva('responsabilidades')}
        >
          <FontAwesomeIcon icon={faUserAlt} /> Responsabilidades
        </button>
        <button 
          className={`nav-item ${secaoAtiva === 'registos' ? 'ativo' : ''}`}
          onClick={() => setSecaoAtiva('registos')}
        >
          <FontAwesomeIcon icon={faTable} /> Registos
        </button>
        <button 
          className={`nav-item ${secaoAtiva === 'historico' ? 'ativo' : ''}`}
          onClick={() => setSecaoAtiva('historico')}
        >
          <FontAwesomeIcon icon={faHistory} /> Histórico de Versões
        </button>
      </div>
      
      {/* Conteúdo da secção ativa */}
      <div className="procedimento-conteudo">
        {secaoAtiva === 'sumario' && procedimento.conteudo && (
          <div className="secao-sumario">
            <div className="card-procedimento">
              <h3 className="card-titulo">
                <FontAwesomeIcon icon={faInfoCircle} /> Objetivo
              </h3>
              <div className="card-conteudo">
                <p>{procedimento.conteudo.objetivo}</p>
              </div>
            </div>

            <div className="card-procedimento">
              <h3 className="card-titulo">
                <FontAwesomeIcon icon={faBook} /> Escopo
              </h3>
              <div className="card-conteudo">
                <p>{procedimento.conteudo.escopo}</p>
              </div>
            </div>

            <div className="card-procedimento">
              <h3 className="card-titulo">
                <FontAwesomeIcon icon={faFileAlt} /> Referências
              </h3>
              <div className="card-conteudo">
                <ul className="lista-referencias">
                  {procedimento.conteudo.referencias.map((referencia, index) => (
                    <li key={index}>{referencia}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card-procedimento">
              <h3 className="card-titulo">
                <FontAwesomeIcon icon={faBook} /> Definições
              </h3>
              <div className="card-conteudo">
                <dl className="lista-definicoes">
                  {procedimento.conteudo.definicoes.map((def, index) => (
                    <React.Fragment key={index}>
                      <dt>{def.termo}</dt>
                      <dd>{def.definicao}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        )}
        
        {secaoAtiva === 'procedimento' && procedimento.conteudo && (
          <div className="secao-procedimento">
            <div className="card-procedimento full-width">
              <h3 className="card-titulo">
                <FontAwesomeIcon icon={faListOl} /> Procedimento
              </h3>
              <div className="card-conteudo">
                {procedimento.conteudo.procedimento.split('\n\n').map((paragrafo, index) => (
                  <div key={index} className="paragrafo-procedimento">
                    {paragrafo.split('\n').map((linha, idx) => (
                      <p key={idx}>{linha}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {procedimento.conteudo.anexos.length > 0 && (
              <div className="card-procedimento">
                <h3 className="card-titulo">
                  <FontAwesomeIcon icon={faPaperclip} /> Anexos
                </h3>
                <div className="card-conteudo">
                  <ul className="lista-anexos">
                    {procedimento.conteudo.anexos.map((anexo, index) => (
                      <li key={index} className="item-anexo">
                        <a href="#" className="link-anexo">
                          <FontAwesomeIcon icon={faFileAlt} /> {anexo.nome}
                        </a>
                        <span className="anexo-descricao">{anexo.descricao}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
        
        {secaoAtiva === 'responsabilidades' && procedimento.conteudo && (
          <div className="secao-responsabilidades">
            <div className="card-procedimento full-width">
              <h3 className="card-titulo">
                <FontAwesomeIcon icon={faUserAlt} /> Matriz de Responsabilidades
              </h3>
              <div className="card-conteudo">
                {procedimento.conteudo.responsabilidades.map((resp, index) => (
                  <div key={index} className="responsabilidade-item">
                    <h4 className="cargo-titulo">{resp.cargo}</h4>
                    <ul className="lista-responsabilidades">
                      {resp.responsabilidades.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {secaoAtiva === 'registos' && procedimento.conteudo && (
          <div className="secao-registos">
            <div className="card-procedimento full-width">
              <h3 className="card-titulo">
                <FontAwesomeIcon icon={faTable} /> Registos Associados
              </h3>
              <div className="card-conteudo">
                <table className="tabela-registos">
                  <thead>
                    <tr>
                      <th>Nome do Registo</th>
                      <th>Código</th>
                      <th>Tempo de Retenção</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {procedimento.conteudo.registos.map((registo, index) => (
                      <tr key={index}>
                        <td>{registo.nome}</td>
                        <td><span className="codigo-badge small">{registo.codigo}</span></td>
                        <td>{registo.retencao}</td>
                        <td>
                          <div className="acoes-registo">
                            <button className="btn-icone" title="Ver Registo">
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button className="btn-icone" title="Descarregar">
                              <FontAwesomeIcon icon={faDownload} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {secaoAtiva === 'historico' && procedimento.historico_versoes && (
          <div className="secao-historico">
            <div className="card-procedimento full-width">
              <h3 className="card-titulo">
                <FontAwesomeIcon icon={faHistory} /> Histórico de Versões
              </h3>
              <div className="card-conteudo">
                <div className="timeline-historico">
                  {procedimento.historico_versoes.map((versao, index) => (
                    <div key={index} className="historico-item">
                      <div className="historico-versao">
                        <span className="versao-badge">{versao.versao}</span>
                      </div>
                      <div className="historico-conteudo">
                        <div className="historico-cabecalho">
                          <span className="historico-data">
                            <FontAwesomeIcon icon={faCalendarAlt} /> {new Date(versao.data).toLocaleDateString('pt-PT')}
                          </span>
                          <span className="historico-autor">
                            <FontAwesomeIcon icon={faUserAlt} /> {versao.autor}
                          </span>
                        </div>
                        <div className="historico-alteracoes">
                          <p>{versao.alteracoes}</p>
                        </div>
                        {index === 0 && (
                          <div className="versao-ativa">
                            <span className="badge status-ativo">Versão Atual</span>
                          </div>
                        )}
                        {index > 0 && (
                          <div className="versao-acoes">
                            <button className="btn-link">Ver esta versão</button>
                            <button className="btn-link">Comparar com atual</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProcedimento;