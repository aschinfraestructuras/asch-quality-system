// DetalheFornecedor.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabase } from "../services/supabaseClient";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Componentes
import LoadingState from "../components/LoadingState";

import ErrorState from "../components/ErrorState";



// Tipos
interface Fornecedor {
  id: number;
  nome: string;
  tipo: string;
  classificacao: number;
  email: string;
  telefone: string;
  morada: string;
  nif: string;
  pessoa_contacto: string;
  ultimo_pedido: string;
  status: string;
  materiais_fornecidos: string[];
  data_inicio_relacao: string;
  notas: string;
}

interface Pedido {
  id: number;
  data: string;
  referencia: string;
  valor: number;
  status: string;
  materiais: string[];
}

interface Avaliacao {
  id: number;
  data: string;
  pontuacao: number;
  criterios: {
    qualidade: number;
    prazo: number;
    preco: number;
    atendimento: number;
  };
  comentario: string;
  avaliador: string;
}

const DetalheFornecedor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [tabAtiva, setTabAtiva] = useState<string>('info');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDados = async () => {
      try {
        setIsLoading(true);
        
        // Em um cenário real, isto seria chamado do Supabase
        // Simulando dados para demonstração
        setTimeout(() => {
          // Dados simulados do fornecedor
          const fornecedorSimulado: Fornecedor = {
            id: 1,
            nome: 'Cimentos Portugal, Lda',
            tipo: 'Materiais',
            classificacao: 4.8,
            email: 'contacto@cimentosportugal.pt',
            telefone: '211234567',
            morada: 'Rua da Indústria, 123, 2750-001 Lisboa',
            nif: '500123456',
            pessoa_contacto: 'António Silva',
            ultimo_pedido: '2025-04-10',
            status: 'ativo',
            materiais_fornecidos: ['Cimento Portland', 'Betão pré-misturado', 'Argamassa'],
            data_inicio_relacao: '2018-05-23',
            notas: 'Fornecedor principal de cimento para obras de grande dimensão.'
          };
          
          // Pedidos simulados
          const pedidosSimulados: Pedido[] = [
            {
              id: 101,
              data: '2025-04-10',
              referencia: 'PED-2025-042',
              valor: 12500,
              status: 'entregue',
              materiais: ['Cimento Portland', 'Argamassa']
            },
            {
              id: 95,
              data: '2025-03-22',
              referencia: 'PED-2025-036',
              valor: 8750,
              status: 'entregue',
              materiais: ['Betão pré-misturado']
            },
            {
              id: 87,
              data: '2025-02-15',
              referencia: 'PED-2025-021',
              valor: 15000,
              status: 'entregue',
              materiais: ['Cimento Portland', 'Betão pré-misturado']
            },
            {
              id: 82,
              data: '2025-01-30',
              referencia: 'PED-2025-014',
              valor: 9800,
              status: 'entregue',
              materiais: ['Argamassa', 'Cimento Portland']
            }
          ];
          
          // Avaliações simuladas
          const avaliacoesSimuladas: Avaliacao[] = [
            {
              id: 201,
              data: '2025-04-15',
              pontuacao: 4.8,
              criterios: {
                qualidade: 5,
                prazo: 4.5,
                preco: 4.5,
                atendimento: 5
              },
              comentario: 'Excelente qualidade dos materiais e entrega dentro do prazo.',
              avaliador: 'João Silva'
            },
            {
              id: 185,
              data: '2025-01-20',
              pontuacao: 4.6,
              criterios: {
                qualidade: 5,
                prazo: 4,
                preco: 4.5,
                atendimento: 5
              },
              comentario: 'Materiais de alta qualidade, mas houve um pequeno atraso na entrega.',
              avaliador: 'Ana Costa'
            },
            {
              id: 172,
              data: '2024-10-05',
              pontuacao: 4.9,
              criterios: {
                qualidade: 5,
                prazo: 5,
                preco: 4.5,
                atendimento: 5
              },
              comentario: 'Fornecedor extremamente profissional e confiável.',
              avaliador: 'Ricardo Pereira'
            }
          ];
          
          setFornecedor(fornecedorSimulado);
          setPedidos(pedidosSimulados);
          setAvaliacoes(avaliacoesSimuladas);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error('Erro ao carregar dados do fornecedor:', err);
        setError('Não foi possível carregar os dados do fornecedor.');
        setIsLoading(false);
      }
    };
    
    fetchDados();
  }, [id]);
  
  if (isLoading) {
    return <LoadingState message="A carregar dados do fornecedor..." />;
  }
  
  if (error || !fornecedor) {
    return <ErrorState message={error || 'Fornecedor não encontrado'} onRetry={() => navigate('/fornecedores')} />;
  }
  
  const calcularMediaPorCriterio = (criterio: keyof Avaliacao['criterios']) => {
    if (avaliacoes.length === 0) return 0;
    return avaliacoes.reduce((acc, av) => acc + av.criterios[criterio], 0) / avaliacoes.length;
  };
  
  const dadosGraficoAvaliacoes = [
    {
      nome: 'Qualidade',
      valor: calcularMediaPorCriterio('qualidade'),
      maximo: 5
    },
    {
      nome: 'Prazo',
      valor: calcularMediaPorCriterio('prazo'),
      maximo: 5
    },
    {
      nome: 'Preço',
      valor: calcularMediaPorCriterio('preco'),
      maximo: 5
    },
    {
      nome: 'Atendimento',
      valor: calcularMediaPorCriterio('atendimento'),
      maximo: 5
    }
  ];
  
  return (
    <div className="detalhe-fornecedor-container">
      <div className="page-header">
        <div className="page-title">
          <h1>
            <FontAwesomeIcon icon="building" /> {fornecedor.nome}
          </h1>
          <div className="fornecedor-meta">
            <span className={`badge status-${fornecedor.status}`}>
              {fornecedor.status === 'ativo' ? 'Ativo' : 'Inativo'}
            </span>
            <span className="tipo-fornecedor">{fornecedor.tipo}</span>
            <div className="classificacao-compact">
              <FontAwesomeIcon icon="star" className="estrela-preenchida" />
              <span>{fornecedor.classificacao.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="page-actions">
          <button className="botao-secundario">
            <FontAwesomeIcon icon="pencil-alt" /> Editar
          </button>
          
          <Link to={`/fornecedores/${fornecedor.id}/avaliacao`} className="botao-primario">
            <FontAwesomeIcon icon="star" /> Avaliar
          </Link>
          
          <div className="botao-dropdown">
            <button className="botao-secundario">
              <FontAwesomeIcon icon="ellipsis-v" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="tabs-navegacao">
        <button 
          className={tabAtiva === 'info' ? 'tab-ativa' : ''}
          onClick={() => setTabAtiva('info')}
        >
          <FontAwesomeIcon icon="info-circle" /> Informações
        </button>
        <button 
          className={tabAtiva === 'pedidos' ? 'tab-ativa' : ''}
          onClick={() => setTabAtiva('pedidos')}
        >
          <FontAwesomeIcon icon="shopping-cart" /> Pedidos
        </button>
        <button 
          className={tabAtiva === 'avaliacoes' ? 'tab-ativa' : ''}
          onClick={() => setTabAtiva('avaliacoes')}
        >
          <FontAwesomeIcon icon="star" /> Avaliações
        </button>
        <button 
          className={tabAtiva === 'contratos' ? 'tab-ativa' : ''}
          onClick={() => setTabAtiva('contratos')}
        >
          <FontAwesomeIcon icon="file-contract" /> Contratos
        </button>
      </div>
      
      <div className="tab-conteudo">
        {tabAtiva === 'info' && (
          <div className="grid-info-fornecedor">
            <div className="card-info">
              <h3 className="card-titulo">
                <FontAwesomeIcon icon="id-card" /> Dados Principais
              </h3>
              <div className="lista-campos">
                <div className="campo">
                  <span className="campo-label">NIF</span>
                  <span className="campo-valor">{fornecedor.nif}</span>
                </div>
                <div className="campo">
                  <span className="campo-label">Morada</span>
                  <span className="campo-valor">{fornecedor.morada}</span>
                </div>
                <div className="campo">
                  <span className="campo-label">Email</span>
                  <span className="campo-valor">{fornecedor.email}</span>
                </div>
                <div className="campo">
                  <span className="campo-label">Telefone</span>
                  <span className="campo-valor">{fornecedor.telefone}</span>
                </div>
                <div className="campo">
                  <span className="campo-label">Pessoa de Contacto</span>
                  <span className="campo-valor">{fornecedor.pessoa_contacto}</span>
                </div>
                <div className="campo">
                  <span className="campo-label">Data de Início</span>
                  <span className="campo-valor">{new Date(fornecedor.data_inicio_relacao).toLocaleDateString('pt-PT')}</span>
                </div>
              </div>
            </div>
            
            <div className="card-info">
              <h3 className="card-titulo">
                <FontAwesomeIcon icon="cube" /> Materiais Fornecidos
              </h3>
              <div className="lista-materiais">
                {fornecedor.materiais_fornecidos.map((material, index) => (
                  <span key={index} className="badge material">
                    {material}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="card-info notas">
              <h3 className="card-titulo">
                <FontAwesomeIcon icon="sticky-note" /> Notas
              </h3>
              <p className="notas-texto">{fornecedor.notas}</p>
            </div>
            
            <div className="card-info">
              <h3 className="card-titulo">
                <FontAwesomeIcon icon="chart-bar" /> Avaliação Média
              </h3>
              <div className="grafico-container">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dadosGraficoAvaliacoes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis domain={[0, 5]} tickCount={6} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#4299e1" 
                      strokeWidth={2} 
                      dot={{ r: 5 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="maximo" 
                      stroke="#e2e8f0" 
                      strokeWidth={1} 
                      strokeDasharray="5 5" 
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {tabAtiva === 'pedidos' && (
          <div className="pedidos-container">
            <div className="acoes-pedidos">
              <button className="botao-primario">
                <FontAwesomeIcon icon="plus" /> Novo Pedido
              </button>
              <div className="filtros-pedidos">
                <select className="select-estilizado pequeno">
                  <option value="todos">Todos os Pedidos</option>
                  <option value="em_processo">Em Processo</option>
                  <option value="entregue">Entregues</option>
                  <option value="cancelado">Cancelados</option>
                </select>
              </div>
            </div>
            
            <div className="tabela-pedidos">
              <div className="tabela-cabecalho">
                <div className="coluna">Referência</div>
                <div className="coluna">Data</div>
                <div className="coluna">Valor</div>
                <div className="coluna">Materiais</div>
                <div className="coluna">Status</div>
                <div className="coluna">Ações</div>
              </div>
              
              {pedidos.map(pedido => (
                <div key={pedido.id} className="tabela-linha">
                  <div className="coluna">{pedido.referencia}</div>
                  <div className="coluna">{new Date(pedido.data).toLocaleDateString('pt-PT')}</div>
                  <div className="coluna">{pedido.valor.toLocaleString('pt-PT')} €</div>
                  <div className="coluna">
                    <div className="lista-materiais-compact">
                      {pedido.materiais.map((material, index) => (
                        <span key={index} className="badge material-mini">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="coluna">
                    <span className={`badge status-pedido-${pedido.status}`}>
                      {pedido.status === 'entregue' ? 'Entregue' : 
                       pedido.status === 'em_processo' ? 'Em Processo' : 'Cancelado'}
                    </span>
                  </div>
                  <div className="coluna acoes">
                    <button className="botao-mini">
                      <FontAwesomeIcon icon="eye" />
                    </button>
                    <button className="botao-mini">
                      <FontAwesomeIcon icon="file-pdf" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {tabAtiva === 'avaliacoes' && (
          <div className="avaliacoes-container">
            <div className="resumo-avaliacoes">
              <div className="pontuacao-geral">
                <div className="pontuacao-valor">{fornecedor.classificacao.toFixed(1)}</div>
                <div className="pontuacao-estrelas">
                  {[1, 2, 3, 4, 5].map(valor => (
                    <FontAwesomeIcon 
                      key={valor}
                      icon={valor <= Math.round(fornecedor.classificacao) ? "star" : ["far", "star"]} 
                      className={valor <= Math.round(fornecedor.classificacao) ? "estrela-preenchida" : "estrela-vazia"}
                    />
                  ))}
                </div>
                <div className="pontuacao-info">
                  Baseada em {avaliacoes.length} avaliações
                </div>
              </div>
              
              <div className="criterios-avaliacoes">
                {dadosGraficoAvaliacoes.map(criterio => (
                  <div key={criterio.nome} className="criterio-item">
                    <div className="criterio-nome">{criterio.nome}</div>
                    <div className="criterio-barra-container">
                      <div 
                        className="criterio-barra" 
                        style={{ width: `${(criterio.valor / 5) * 100}%` }}
                      ></div>
                    </div>
                    <div className="criterio-valor">{criterio.valor.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lista-avaliacoes">
              <h3 className="secao-titulo">Histórico de Avaliações</h3>
              
              {avaliacoes.map(avaliacao => (
                <div key={avaliacao.id} className="avaliacao-item">
                  <div className="avaliacao-cabecalho">
                    <div className="avaliacao-meta">
                      <span className="avaliacao-data">
                        {new Date(avaliacao.data).toLocaleDateString('pt-PT')}
                      </span>
                      <span className="avaliacao-autor">
                        por {avaliacao.avaliador}
                      </span>
                    </div>
                    <div className="avaliacao-pontuacao">
                      <span className="valor">{avaliacao.pontuacao.toFixed(1)}</span>
                      <span className="estrelas">
                        {[1, 2, 3, 4, 5].map(valor => (
                          <FontAwesomeIcon 
                            key={valor}
                            icon={valor <= Math.round(avaliacao.pontuacao) ? "star" : ["far", "star"]} 
                            className={valor <= Math.round(avaliacao.pontuacao) ? "estrela-preenchida" : "estrela-vazia"}
                          />
                        ))}
                      </span>
                    </div>
                  </div>
                  
                  <div className="avaliacao-detalhes">
                    <div className="avaliacao-criterios">
                      <div className="criterio">
                        <span className="criterio-label">Qualidade</span>
                        <span className="criterio-valor">{avaliacao.criterios.qualidade.toFixed(1)}</span>
                      </div>
                      <div className="criterio">
                        <span className="criterio-label">Prazo</span>
                        <span className="criterio-valor">{avaliacao.criterios.prazo.toFixed(1)}</span>
                      </div>
                      <div className="criterio">
                        <span className="criterio-label">Preço</span>
                        <span className="criterio-valor">{avaliacao.criterios.preco.toFixed(1)}</span>
                      </div>
                      <div className="criterio">
                        <span className="criterio-label">Atendimento</span>
                        <span className="criterio-valor">{avaliacao.criterios.atendimento.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="avaliacao-comentario">
                      <p>{avaliacao.comentario}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {tabAtiva === 'contratos' && (
          <div className="contratos-container">
            <div className="acoes-contratos">
              <button className="botao-primario">
                <FontAwesomeIcon icon="plus" /> Novo Contrato
              </button>
            </div>
            
            <div className="estado-vazio">
              <FontAwesomeIcon icon="file-contract" />
              <h3>Nenhum contrato registado</h3>
              <p>Não há contratos registados para este fornecedor atualmente.</p>
              <button className="botao-primario">
                <FontAwesomeIcon icon="plus" /> Adicionar Contrato
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalheFornecedor;