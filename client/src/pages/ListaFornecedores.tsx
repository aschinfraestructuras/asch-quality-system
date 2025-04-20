import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ListaFornecedores: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [termoPesquisa, setTermoPesquisa] = useState('');

  // 🔧 MOCK TEMPORÁRIO (substituível por fetch futuramente)
  useEffect(() => {
    const mock = [
      {
        id: 1,
        nome: 'Betonilha Express',
        tipo: 'Material',
        classificacao: 4.3,
        email: 'betonilha@exemplo.com',
        telefone: '912 345 678',
        ultimo_pedido: '2025-03-12',
        status: 'ativo',
      },
      {
        id: 2,
        nome: 'Ferragens Lisboa',
        tipo: 'Equipamento',
        classificacao: 3.7,
        email: 'ferragens@lisboa.pt',
        telefone: '934 567 890',
        ultimo_pedido: '2025-01-05',
        status: 'inativo',
      },
    ];
    setFornecedores(mock);
  }, []);

  // 🔎 Filtro ativo
  const fornecedoresFiltrados = fornecedores.filter((f) => {
    const tipoOK = filtroTipo === 'todos' || f.tipo === filtroTipo;
    const statusOK = filtroStatus === 'todos' || f.status === filtroStatus;
    const pesquisaOK =
      termoPesquisa === '' || f.nome.toLowerCase().includes(termoPesquisa.toLowerCase());

    return tipoOK && statusOK && pesquisaOK;
  });

  return (
    <div className="pagina-fornecedores">
      <h2>Lista de Fornecedores</h2>

      {/* FILTROS */}
      <div className="filtros">
        <div className="filtro-grupo">
          <label htmlFor="filtro-tipo">Tipo:</label>
          <select
            id="filtro-tipo"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="Material">Material</option>
            <option value="Equipamento">Equipamento</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label htmlFor="filtro-status">Status:</label>
          <select
            id="filtro-status"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
        </div>

        <div className="filtro-grupo pesquisa">
          <label htmlFor="pesquisa-fornecedor">Pesquisar:</label>
          <div className="campo-pesquisa">
            <FontAwesomeIcon icon="search" className="icone-pesquisa" />
            <input
              type="text"
              id="pesquisa-fornecedor"
              placeholder="Pesquisar fornecedor..."
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />
            {termoPesquisa && (
              <button
                className="botao-limpar-pesquisa"
                onClick={() => setTermoPesquisa('')}
              >
                <FontAwesomeIcon icon="times" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABELA */}
      <div className="fornecedores-tabela">
        <div className="tabela-cabecalho">
          <div className="coluna">Nome</div>
          <div className="coluna">Tipo</div>
          <div className="coluna">Classificação</div>
          <div className="coluna">Contacto</div>
          <div className="coluna">Último Pedido</div>
          <div className="coluna">Status</div>
          <div className="coluna">Ações</div>
        </div>

        {fornecedoresFiltrados.length === 0 ? (
          <div className="tabela-vazia">
            <p>Nenhum fornecedor encontrado com os critérios selecionados.</p>
            <button
              className="botao-secundario"
              onClick={() => {
                setFiltroTipo('todos');
                setFiltroStatus('todos');
                setTermoPesquisa('');
              }}
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          fornecedoresFiltrados.map((fornecedor) => (
            <div key={fornecedor.id} className="tabela-linha">
              <div className="coluna">{fornecedor.nome}</div>
              <div className="coluna">{fornecedor.tipo}</div>
              <div className="coluna">
                <div className="classificacao">
                  <span className="estrelas">
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <FontAwesomeIcon
                        key={valor}
                        icon={
                          valor <= Math.round(fornecedor.classificacao)
                            ? 'star'
                            : ['far', 'star']
                        }
                        className={
                          valor <= Math.round(fornecedor.classificacao)
                            ? 'estrela-preenchida'
                            : 'estrela-vazia'
                        }
                      />
                    ))}
                  </span>
                  <span className="valor">{fornecedor.classificacao.toFixed(1)}</span>
                </div>
              </div>
              <div className="coluna">
                <div className="contacto-info">
                  <span>
                    <FontAwesomeIcon icon="envelope" /> {fornecedor.email}
                  </span>
                  <span>
                    <FontAwesomeIcon icon="phone" /> {fornecedor.telefone}
                  </span>
                </div>
              </div>
              <div className="coluna">
                {new Date(fornecedor.ultimo_pedido).toLocaleDateString('pt-PT')}
              </div>
              <div className="coluna">
                <span className={`badge status-${fornecedor.status}`}>
                  {fornecedor.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="coluna acoes">
                <Link to={`/fornecedores/${fornecedor.id}`} className="botao-mini">
                  <FontAwesomeIcon icon="eye" />
                </Link>
                <Link
                  to={`/fornecedores/${fornecedor.id}/avaliacao`}
                  className="botao-mini"
                >
                  <FontAwesomeIcon icon="star" />
                </Link>
                <button className="botao-mini">
                  <FontAwesomeIcon icon="ellipsis-v" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINAÇÃO (simples visual) */}
      <div className="paginacao">
        <button className="botao-paginacao" disabled>
          <FontAwesomeIcon icon="chevron-left" /> Anterior
        </button>
        <div className="paginas">
          <button className="pagina ativa">1</button>
          <button className="pagina">2</button>
          <button className="pagina">3</button>
        </div>
        <button className="botao-paginacao">
          Próxima <FontAwesomeIcon icon="chevron-right" />
        </button>
      </div>
    </div>
  );
};

export default ListaFornecedores;
