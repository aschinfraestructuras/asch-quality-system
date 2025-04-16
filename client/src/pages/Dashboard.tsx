import '../styles/Dashboard.css';

const Dashboard = () => {
  // Dados de exemplo para mostrar no dashboard
  const projects = [
    { id: 1, name: 'Obra Ferroviária Setúbal', status: 'Em andamento', progress: 75 },
    { id: 2, name: 'Ponte Vasco da Gama - Manutenção', status: 'Planejado', progress: 30 },
    { id: 3, name: 'Ampliação Terminal Portuário', status: 'Em andamento', progress: 45 },
  ];

  const recentChecklists = [
    { id: 1, name: 'Inspeção de Execução - Fundações', type: 'Execução', date: '15/04/2025', status: 'Completo' },
    { id: 2, name: 'Recebimento de Materiais - Aço', type: 'Material', date: '14/04/2025', status: 'Não Conforme' },
    { id: 3, name: 'Verificação de Projetos - Estrutura', type: 'Projeto', date: '13/04/2025', status: 'Pendente' },
  ];

  const recentTests = [
    { id: 1, name: 'Ensaio de Compressão - Concreto', category: 'Concreto', date: '16/04/2025', result: 'Conforme' },
    { id: 2, name: 'Análise Granulométrica - Balastro', category: 'Agregados', date: '15/04/2025', result: 'Em análise' },
    { id: 3, name: 'Ensaio CBR - Subleito', category: 'Solos', date: '12/04/2025', result: 'Não Conforme' },
  ];

  const pendingActions = [
    { id: 1, name: 'Aprovar relatório de ensaios', priority: 'Alta', deadline: '20/04/2025' },
    { id: 2, name: 'Revisar plano de qualidade', priority: 'Média', deadline: '25/04/2025' },
    { id: 3, name: 'Corrigir não conformidade #125', priority: 'Alta', deadline: '18/04/2025' },
  ];

  return (
    <div className="dashboard">
      <h1>Sistema de Gestão de Qualidade ASCH</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Projetos</h3>
          <div className="stat-value">7</div>
          <div className="stat-label">Ativos</div>
        </div>
        <div className="stat-card">
          <h3>Checklists</h3>
          <div className="stat-value">42</div>
          <div className="stat-label">Esta semana</div>
        </div>
        <div className="stat-card">
          <h3>Ensaios</h3>
          <div className="stat-value">18</div>
          <div className="stat-label">Em andamento</div>
        </div>
        <div className="stat-card">
          <h3>Não Conformidades</h3>
          <div className="stat-value">5</div>
          <div className="stat-label">Abertas</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="grid-item">
          <h2>Projetos em Andamento</h2>
          <div className="project-list">
            {projects.map(project => (
              <div key={project.id} className="project-item">
                <div className="project-info">
                  <h4>{project.name}</h4>
                  <span className={`status status-${project.status.toLowerCase().replace(' ', '-')}`}>
                    {project.status}
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${project.progress}%` }}
                    title={`${project.progress}% concluído`}
                  ></div>
                </div>
                <div className="project-progress">{project.progress}%</div>
              </div>
            ))}
          </div>
          <div className="action-button">
            <button>Ver Todos os Projetos</button>
          </div>
        </div>

        <div className="grid-item">
          <h2>Checklists Recentes</h2>
          <div className="checklist-list">
            {recentChecklists.map(checklist => (
              <div key={checklist.id} className="checklist-item">
                <div className={`checklist-icon checklist-${checklist.type.toLowerCase()}`}>
                  {checklist.type.charAt(0)}
                </div>
                <div className="checklist-info">
                  <h4>{checklist.name}</h4>
                  <div className="checklist-meta">
                    <span className="checklist-date">{checklist.date}</span>
                    <span className={`checklist-status status-${checklist.status.toLowerCase().replace(' ', '-')}`}>
                      {checklist.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="action-button">
            <button>Novo Checklist</button>
          </div>
        </div>

        <div className="grid-item">
          <h2>Ensaios Recentes</h2>
          <div className="test-list">
            {recentTests.map(test => (
              <div key={test.id} className="test-item">
                <div className={`test-icon test-${test.category.toLowerCase()}`}>
                  {test.category.charAt(0)}
                </div>
                <div className="test-info">
                  <h4>{test.name}</h4>
                  <div className="test-meta">
                    <span className="test-date">{test.date}</span>
                    <span className={`test-result result-${test.result.toLowerCase().replace(' ', '-')}`}>
                      {test.result}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="action-button">
            <button>Gerenciar Ensaios</button>
          </div>
        </div>

        <div className="grid-item">
          <h2>Ações Pendentes</h2>
          <div className="action-list">
            {pendingActions.map(action => (
              <div key={action.id} className="action-item">
                <div className="action-info">
                  <h4>{action.name}</h4>
                  <div className="action-meta">
                    <span className={`priority priority-${action.priority.toLowerCase()}`}>
                      {action.priority}
                    </span>
                    <span className="deadline">Prazo: {action.deadline}</span>
                  </div>
                </div>
                <div className="action-controls">
                  <button className="action-complete">Concluir</button>
                </div>
              </div>
            ))}
          </div>
          <div className="action-button">
            <button>Ver Todas as Ações</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
