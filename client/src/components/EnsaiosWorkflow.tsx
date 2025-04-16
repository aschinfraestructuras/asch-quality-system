import { useState} from 'react';
import '../styles/EnsaiosWorkflow.css';

// Tipos para o fluxo de trabalho
interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  responsibleRoles: string[];
  estimatedDuration: number; // em horas
  order: number;
  requiredDocuments?: string[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  ensaioType: string;
}

interface EnsaioWorkflow {
  id: string;
  ensaioId: string;
  ensaioName: string;
  templateId: string;
  currentStep: number;
  status: 'Em andamento' | 'Concluído' | 'Em atraso' | 'Pausado';
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  stepHistory: {
    stepId: string;
    startDate: string;
    endDate?: string | null;
    duration?: number;
    comments?: string;
    performedBy?: string;
  }[];
}

// Dados de exemplo para templates de fluxo de trabalho
const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'wf-betao-comp',
    name: 'Fluxo de Ensaio de Compressão de Betão',
    description: 'Fluxo de trabalho padrão para ensaios de compressão de betão conforme EN 12390-3',
    ensaioType: 'Betão - Compressão',
    steps: [
      {
        id: 'step-1',
        name: 'Solicitação de Ensaio',
        description: 'Registo da solicitação e verificação dos requisitos',
        responsibleRoles: ['Gestor de Qualidade', 'Engenheiro'],
        estimatedDuration: 2,
        order: 1,
        requiredDocuments: ['Formulário de Solicitação', 'Plano de Controlo']
      },
      {
        id: 'step-2',
        name: 'Recolha de Amostras',
        description: 'Recolha e identificação dos provetes de betão',
        responsibleRoles: ['Técnico de Laboratório', 'Técnico de Campo'],
        estimatedDuration: 4,
        order: 2
      },
      {
        id: 'step-3',
        name: 'Cura dos Provetes',
        description: 'Cura dos provetes em condições controladas',
        responsibleRoles: ['Técnico de Laboratório'],
        estimatedDuration: 672, // 28 dias em horas
        order: 3
      },
      {
        id: 'step-4',
        name: 'Preparação do Ensaio',
        description: 'Verificação e calibração do equipamento',
        responsibleRoles: ['Técnico de Laboratório'],
        estimatedDuration: 1,
        order: 4
      },
      {
        id: 'step-5',
        name: 'Execução do Ensaio',
        description: 'Realização do ensaio de compressão',
        responsibleRoles: ['Técnico de Laboratório'],
        estimatedDuration: 2,
        order: 5
      },
      {
        id: 'step-6',
        name: 'Registo e Análise',
        description: 'Registo dos resultados e análise preliminar',
        responsibleRoles: ['Técnico de Laboratório', 'Engenheiro'],
        estimatedDuration: 3,
        order: 6
      },
      {
        id: 'step-7',
        name: 'Verificação Técnica',
        description: 'Verificação técnica dos resultados',
        responsibleRoles: ['Engenheiro'],
        estimatedDuration: 4,
        order: 7
      },
      {
        id: 'step-8',
        name: 'Aprovação Final',
        description: 'Aprovação final e emissão do relatório',
        responsibleRoles: ['Gestor de Qualidade'],
        estimatedDuration: 2,
        order: 8,
        requiredDocuments: ['Relatório de Ensaio', 'Evidências Fotográficas']
      }
    ]
  },
  {
    id: 'wf-solo-cbr',
    name: 'Fluxo de Ensaio CBR de Solos',
    description: 'Fluxo de trabalho padrão para ensaios CBR de solos conforme LNEC E 198',
    ensaioType: 'Solos - CBR',
    steps: [
      {
        id: 'step-1',
        name: 'Solicitação de Ensaio',
        description: 'Registo da solicitação e verificação dos requisitos',
        responsibleRoles: ['Gestor de Qualidade', 'Engenheiro'],
        estimatedDuration: 2,
        order: 1,
        requiredDocuments: ['Formulário de Solicitação', 'Plano de Controlo']
      },
      {
        id: 'step-2',
        name: 'Recolha de Amostras',
        description: 'Recolha e identificação das amostras de solo',
        responsibleRoles: ['Técnico de Laboratório', 'Técnico de Campo'],
        estimatedDuration: 4,
        order: 2
      },
      {
        id: 'step-3',
        name: 'Preparação da Amostra',
        description: 'Secagem, desagregação e peneiração da amostra',
        responsibleRoles: ['Técnico de Laboratório'],
        estimatedDuration: 8,
        order: 3
      },
      {
        id: 'step-4',
        name: 'Determinação do Teor de Humidade Ótimo',
        description: 'Ensaio de compactação para determinar o teor de humidade ótimo',
        responsibleRoles: ['Técnico de Laboratório'],
        estimatedDuration: 8,
        order: 4
      },
      {
        id: 'step-5',
        name: 'Moldagem do Provete',
        description: 'Preparação e moldagem do provete para o ensaio CBR',
        responsibleRoles: ['Técnico de Laboratório'],
        estimatedDuration: 4,
        order: 5
      },
      {
        id: 'step-6',
        name: 'Embebição',
        description: 'Embebição do provete durante 96 horas',
        responsibleRoles: ['Técnico de Laboratório'],
        estimatedDuration: 96,
        order: 6
      },
      {
        id: 'step-7',
        name: 'Execução do Ensaio CBR',
        description: 'Realização do ensaio CBR',
        responsibleRoles: ['Técnico de Laboratório'],
        estimatedDuration: 2,
        order: 7
      },
      {
        id: 'step-8',
        name: 'Registo e Análise',
        description: 'Registo dos resultados e análise preliminar',
        responsibleRoles: ['Técnico de Laboratório', 'Engenheiro'],
        estimatedDuration: 3,
        order: 8
      },
      {
        id: 'step-9',
        name: 'Verificação Técnica',
        description: 'Verificação técnica dos resultados',
        responsibleRoles: ['Engenheiro'],
        estimatedDuration: 4,
        order: 9
      },
      {
        id: 'step-10',
        name: 'Aprovação Final',
        description: 'Aprovação final e emissão do relatório',
        responsibleRoles: ['Gestor de Qualidade'],
        estimatedDuration: 2,
        order: 10,
        requiredDocuments: ['Relatório de Ensaio', 'Gráficos CBR']
      }
    ]
  }
];

// Dados de exemplo para fluxos de trabalho ativos
const activeWorkflows: EnsaioWorkflow[] = [
  {
    id: 'wf-exec-001',
    ensaioId: 'E-2342',
    ensaioName: 'Ensaio de Compressão - Concreto Pilar P12',
    templateId: 'wf-betao-comp',
    currentStep: 6,
    status: 'Em andamento',
    startDate: '12/04/2025',
    estimatedEndDate: '16/05/2025',
    stepHistory: [
      {
        stepId: 'step-1',
        startDate: '12/04/2025 09:30',
        endDate: '12/04/2025 10:45',
        duration: 1.25,
        performedBy: 'Carlos Santos',
        comments: 'Solicitação aprovada conforme requisitos do projeto'
      },
      {
        stepId: 'step-2',
        startDate: '12/04/2025 14:00',
        endDate: '12/04/2025 16:30',
        duration: 2.5,
        performedBy: 'Ana Pereira',
        comments: 'Recolhidos 3 provetes cilíndricos 15x30cm do Pilar P12'
      },
      {
        stepId: 'step-3',
        startDate: '12/04/2025 17:00',
        endDate: '14/05/2025 17:00',
        duration: 768,
        performedBy: 'Sofia Costa',
        comments: 'Cura em tanque a 20±2°C por 32 dias'
      },
      {
        stepId: 'step-4',
        startDate: '15/05/2025 09:00',
        endDate: '15/05/2025 10:00',
        duration: 1,
        performedBy: 'Sofia Costa',
        comments: 'Equipamento verificado e calibrado'
      },
      {
        stepId: 'step-5',
        startDate: '15/05/2025 10:30',
        endDate: '15/05/2025 12:00',
        duration: 1.5,
        performedBy: 'Sofia Costa',
        comments: 'Ensaio realizado sem intercorrências'
      },
      {
        stepId: 'step-6',
        startDate: '15/05/2025 13:30',
        endDate: null,
        performedBy: 'Carlos Santos',
        comments: 'Em análise'
      }
    ]
  },
  {
    id: 'wf-exec-002',
    ensaioId: 'E-2345',
    ensaioName: 'Ensaio CBR - Subleito Acesso Norte',
    templateId: 'wf-solo-cbr',
    currentStep: 4,
    status: 'Em andamento',
    startDate: '14/04/2025',
    estimatedEndDate: '24/04/2025',
    stepHistory: [
      {
        stepId: 'step-1',
        startDate: '14/04/2025 08:30',
        endDate: '14/04/2025 09:45',
        duration: 1.25,
        performedBy: 'Maria Oliveira',
        comments: 'Solicitação aprovada'
      },
      {
        stepId: 'step-2',
        startDate: '14/04/2025 10:00',
        endDate: '14/04/2025 13:30',
        duration: 3.5,
        performedBy: 'João Silva',
        comments: 'Amostras recolhidas no acesso norte km 2+500'
      },
      {
        stepId: 'step-3',
        startDate: '15/04/2025 09:00',
        endDate: '15/04/2025 16:00',
        duration: 7,
        performedBy: 'Ricardo Almeida',
        comments: 'Preparação concluída conforme especificação'
      },
      {
        stepId: 'step-4',
        startDate: '16/04/2025 08:30',
        endDate: null,
        performedBy: 'Ricardo Almeida',
        comments: 'Em andamento'
      }
    ]
  }
];

const EnsaiosWorkflow = () => {
  const [templates] = useState<WorkflowTemplate[]>(workflowTemplates);
  const [workflows, setWorkflows] = useState<EnsaioWorkflow[]>(activeWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showNewWorkflowForm, setShowNewWorkflowForm] = useState<boolean>(false);
  const [newWorkflowData, setNewWorkflowData] = useState({
    ensaioId: '',
    ensaioName: '',
    templateId: ''
  });
  
  // Obter workflow selecionado
  const getSelectedWorkflow = () => {
    return workflows.find(wf => wf.id === selectedWorkflow);
  };
  
  // Obter template selecionado
  const getSelectedTemplate = () => {
    return templates.find(t => t.id === selectedTemplate);
  };
  
  // Obter template de um workflow
  const getWorkflowTemplate = (workflow: EnsaioWorkflow) => {
    return templates.find(t => t.id === workflow.templateId);
  };
  
  // Obter passo atual de um workflow
  const getCurrentStep = (workflow: EnsaioWorkflow) => {
    const template = getWorkflowTemplate(workflow);
    if (!template) return null;
    
    return template.steps.find(step => step.order === workflow.currentStep);
  };
  
  // Calcular progresso do workflow
  const calculateProgress = (workflow: EnsaioWorkflow) => {
    const template = getWorkflowTemplate(workflow);
    if (!template) return 0;
    
    return Math.round((workflow.currentStep / template.steps.length) * 100);
  };
  
  // Calcular duração total estimada
  const calculateTotalDuration = (template: WorkflowTemplate) => {
    return template.steps.reduce((total, step) => total + step.estimatedDuration, 0);
  };
  
  // Formatar duração
  const formatDuration = (hours: number) => {
    if (hours < 24) {
      return `${hours} hora${hours !== 1 ? 's' : ''}`;
    } else if (hours < 48) {
      return `1 dia`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} dias`;
    }
  };
  
  // Avançar para o próximo passo
  const advanceWorkflow = (workflowId: string) => {
    setWorkflows(workflows.map(wf => {
      if (wf.id === workflowId) {
        const template = getWorkflowTemplate(wf);
        if (!template) return wf;
        
        const maxSteps = template.steps.length;
        
        // Atualizar o passo atual na história
        const updatedHistory = [...wf.stepHistory];
        const currentStepIndex = updatedHistory.findIndex(sh => !sh.endDate);
        
        if (currentStepIndex !== -1) {
          updatedHistory[currentStepIndex] = {
            ...updatedHistory[currentStepIndex],
            endDate: new Date().toLocaleString('pt-PT', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            duration: 2 // Valor de exemplo
          };
        }
        
        // Adicionar novo passo à história se não for o último
        if (wf.currentStep < maxSteps) {
          const nextStep = template.steps.find(step => step.order === wf.currentStep + 1);
          
          if (nextStep) {
            updatedHistory.push({
              stepId: nextStep.id,
              startDate: new Date().toLocaleString('pt-PT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              performedBy: 'Utilizador Atual'
            });
          }
        }
        
        // Atualizar o workflow
        return {
          ...wf,
          currentStep: wf.currentStep < maxSteps ? wf.currentStep + 1 : wf.currentStep,
          status: wf.currentStep + 1 >= maxSteps ? 'Concluído' : wf.status,
          actualEndDate: wf.currentStep + 1 >= maxSteps ? new Date().toLocaleDateString('pt-PT') : undefined,
          stepHistory: updatedHistory
        };
      }
      
      return wf;
    }));
  };
  
  // Adicionar novo workflow
  const addNewWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    
    const template = templates.find(t => t.id === newWorkflowData.templateId);
    if (!template) return;
    
    const today = new Date();
    const totalDuration = calculateTotalDuration(template);
    const estimatedEndDate = new Date(today);
    estimatedEndDate.setHours(estimatedEndDate.getHours() + totalDuration);
    
    const newWorkflow: EnsaioWorkflow = {
      id: `wf-exec-${Date.now()}`,
      ensaioId: newWorkflowData.ensaioId,
      ensaioName: newWorkflowData.ensaioName,
      templateId: newWorkflowData.templateId,
      currentStep: 1,
      status: 'Em andamento',
      startDate: today.toLocaleDateString('pt-PT'),
      estimatedEndDate: estimatedEndDate.toLocaleDateString('pt-PT'),
      stepHistory: [
        {
          stepId: template.steps[0].id,
          startDate: today.toLocaleString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          performedBy: 'Utilizador Atual'
        }
      ]
    };
    
    setWorkflows([...workflows, newWorkflow]);
    setNewWorkflowData({
      ensaioId: '',
      ensaioName: '',
      templateId: ''
    });
    setShowNewWorkflowForm(false);
  };
  
  return (
    <div className="ensaios-workflow">
      <div className="workflow-header">
        <h2>Fluxo de Trabalho de Ensaios</h2>
        <button 
          className="new-workflow-btn"
          onClick={() => setShowNewWorkflowForm(true)}
        >
          Novo Fluxo de Trabalho
        </button>
      </div>
      
      <div className="workflow-content">
        <div className="workflow-list">
          <h3>Fluxos de Trabalho Ativos</h3>
          
          <div className="workflow-items">
            {workflows.map(workflow => (
              <div 
                key={workflow.id}
                className={`workflow-item ${selectedWorkflow === workflow.id ? 'selected' : ''}`}
                onClick={() => setSelectedWorkflow(workflow.id)}
              >
                <div className="workflow-item-header">
                  <div className="workflow-name">{workflow.ensaioName}</div>
                  <div className={`workflow-status status-${workflow.status.toLowerCase().replace(' ', '-')}`}>
                    {workflow.status}
                  </div>
                </div>
                
                <div className="workflow-details">
                  <div className="workflow-info">
                    <div className="info-row">
                      <span className="info-label">ID do Ensaio:</span>
                      <span className="info-value">{workflow.ensaioId}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Tipo:</span>
                      <span className="info-value">{getWorkflowTemplate(workflow)?.ensaioType || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Início:</span>
                      <span className="info-value">{workflow.startDate}</span>
                    </div>
                  </div>
                  
                  <div className="workflow-progress-container">
                    <div className="workflow-step">
                      {getCurrentStep(workflow)?.name || 'N/A'}
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${calculateProgress(workflow)}%` }}
                      ></div>
                    </div>
                    <div className="progress-info">
                      {workflow.currentStep} de {getWorkflowTemplate(workflow)?.steps.length || 'N/A'} etapas
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {workflows.length === 0 && (
              <div className="empty-state">
                <p>Não há fluxos de trabalho ativos.</p>
                <button 
                  className="add-workflow-btn"
                  onClick={() => setShowNewWorkflowForm(true)}
                >
                  Adicionar Fluxo de Trabalho
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="workflow-detail">
          {selectedWorkflow ? (
            <div className="workflow-detail-content">
              {(() => {
                const workflow = getSelectedWorkflow();
                const template = workflow ? getWorkflowTemplate(workflow) : null;
                const currentStep = workflow ? getCurrentStep(workflow) : null;
                
                if (!workflow || !template) {
                  return <div className="empty-state">Selecione um fluxo de trabalho para ver os detalhes.</div>;
                }
                
                return (
                  <>
                    <div className="detail-header">
                      <h3>{workflow.ensaioName}</h3>
                      <div className="detail-actions">
                        {workflow.status === 'Em andamento' && (
                          <button 
                            className="advance-btn"
                            onClick={() => advanceWorkflow(workflow.id)}
                            disabled={workflow.currentStep >= template.steps.length}
                          >
                            Avançar para Próxima Etapa
                          </button>
                        )}
                        <button className="print-btn">
                          Imprimir
                        </button>
                      </div>
                    </div>
                    
                    <div className="detail-info">
                      <div className="info-card">
                        <h4>Informações Gerais</h4>
                        <div className="info-content">
                          <div className="info-row">
                            <span className="info-label">ID do Ensaio:</span>
                            <span className="info-value">{workflow.ensaioId}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Tipo de Ensaio:</span>
                            <span className="info-value">{template.ensaioType}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Data de Início:</span>
                            <span className="info-value">{workflow.startDate}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Data de Conclusão Estimada:</span>
                            <span className="info-value">{workflow.estimatedEndDate}</span>
                          </div>
                          {workflow.actualEndDate && (
                            <div className="info-row">
                              <span className="info-label">Data de Conclusão Atual:</span>
                              <span className="info-value">{workflow.actualEndDate}</span>
                            </div>
                          )}
                          <div className="info-row">
                            <span className="info-label">Estado:</span>
                            <span className={`info-value status-value status-${workflow.status.toLowerCase().replace(' ', '-')}`}>
                              {workflow.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="info-card">
                        <h4>Etapa Atual</h4>
                        <div className="info-content">
                          {currentStep ? (
                            <>
                              <div className="current-step-header">
                                <div className="step-name">{currentStep.name}</div>
                                <div className="step-number">Etapa {currentStep.order} de {template.steps.length}</div>
                              </div>
                              
                              <div className="step-description">
                                {currentStep.description}
                              </div>
                              
                              <div className="step-details">
                                <div className="info-row">
                                  <span className="info-label">Responsáveis:</span>
                                  <span className="info-value">{currentStep.responsibleRoles.join(', ')}</span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Duração Estimada:</span>
                                  <span className="info-value">{formatDuration(currentStep.estimatedDuration)}</span>
                                </div>
                                {currentStep.requiredDocuments && (
                                  <div className="info-row">
                                    <span className="info-label">Documentos Necessários:</span>
                                    <span className="info-value">{currentStep.requiredDocuments.join(', ')}</span>
                                  </div>
                                )}
                                
                                <div className="info-row">
                                  <span className="info-label">Iniciado em:</span>
                                  <span className="info-value">
                                    {workflow.stepHistory.find(sh => sh.stepId === currentStep.id)?.startDate || 'N/A'}
                                  </span>
                                </div>
                                
                                <div className="info-row">
                                  <span className="info-label">Realizado por:</span>
                                  <span className="info-value">
                                    {workflow.stepHistory.find(sh => sh.stepId === currentStep.id)?.performedBy || 'N/A'}
                                  </span>
                                </div>
                                
                                {workflow.stepHistory.find(sh => sh.stepId === currentStep.id)?.comments && (
                                  <div className="info-row">
                                    <span className="info-label">Comentários:</span>
                                    <span className="info-value">
                                      {workflow.stepHistory.find(sh => sh.stepId === currentStep.id)?.comments}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="empty-state">Informações da etapa não disponíveis.</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="workflow-timeline-container">
                      <h4>Linha do Tempo</h4>
                      <div className="workflow-timeline">
                        {template.steps.map(step => {
                          const stepHistory = workflow.stepHistory.find(sh => sh.stepId === step.id);
                          const isCompleted = stepHistory?.endDate !== undefined;
                          const isCurrent = step.order === workflow.currentStep;
                          const isPending = step.order > workflow.currentStep;
                          
                          return (
                            <div 
                              key={step.id}
                              className={`timeline-step ${
                                isCompleted 
                                  ? 'completed' 
                                  : isCurrent 
                                    ? 'current' 
                                    : 'pending'
                              }`}
                            >
                              <div className="timeline-step-marker">
                                <div className="step-number">{step.order}</div>
                              </div>
                              <div className="timeline-step-content">
                                <div className="step-header">
                                  <div className="step-name">{step.name}</div>
                                  <div className="step-status">
                                    {isCompleted 
                                      ? 'Concluído' 
                                      : isCurrent 
                                        ? 'Em andamento' 
                                        : 'Pendente'
                                    }
                                  </div>
                                </div>
                                <div className="step-details">
                                  {isCompleted && stepHistory && (
                                    <>
                                      <div className="detail-row">
                                        <span className="detail-label">Início:</span>
                                        <span className="detail-value">{stepHistory.startDate}</span>
                                      </div>
                                      <div className="detail-row">
                                        <span className="detail-label">Conclusão:</span>
                                        <span className="detail-value">{stepHistory.endDate}</span>
                                      </div>
                                      {stepHistory.duration && (
                                        <div className="detail-row">
                                          <span className="detail-label">Duração:</span>
                                          <span className="detail-value">{formatDuration(stepHistory.duration)}</span>
                                        </div>
                                      )}
                                      {stepHistory.performedBy && (
                                        <div className="detail-row">
                                          <span className="detail-label">Realizado por:</span>
                                          <span className="detail-value">{stepHistory.performedBy}</span>
                                        </div>
                                      )}
                                    </>
                                  )}
                                  
                                  {isCurrent && stepHistory && (
                                    <>
                                      <div className="detail-row">
                                        <span className="detail-label">Início:</span>
                                        <span className="detail-value">{stepHistory.startDate}</span>
                                      </div>
                                      <div className="detail-row">
                                        <span className="detail-label">Realizado por:</span>
                                        <span className="detail-value">{stepHistory.performedBy || 'N/A'}</span>
                                      </div>
                                    </>
                                  )}
                                  
                                  {isPending && (
                                    <div className="detail-row">
                                      <span className="detail-label">Duração estimada:</span>
                                      <span className="detail-value">{formatDuration(step.estimatedDuration)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : selectedTemplate ? (
            <div className="template-detail-content">
              {(() => {
                const template = getSelectedTemplate();
                
                if (!template) {
                  return <div className="empty-state">Selecione um modelo para ver os detalhes.</div>;
                }
                
                return (
                  <>
                    <div className="detail-header">
                      <h3>{template.name}</h3>
                      <div className="detail-actions">
                        <button 
                          className="use-template-btn"
                          onClick={() => {
                            setNewWorkflowData({
                              ...newWorkflowData,
                              templateId: template.id
                            });
                            setShowNewWorkflowForm(true);
                          }}
                        >
                          Usar este Modelo
                        </button>
                      </div>
                    </div>
                    
                    <div className="template-info">
                      <div className="info-card">
                        <h4>Informações Gerais</h4>
                        <div className="info-content">
                          <div className="info-row">
                            <span className="info-label">Tipo de Ensaio:</span>
                            <span className="info-value">{template.ensaioType}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Total de Etapas:</span>
                            <span className="info-value">{template.steps.length}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Duração Total Estimada:</span>
                            <span className="info-value">{formatDuration(calculateTotalDuration(template))}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Descrição:</span>
                            <span className="info-value">{template.description}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="template-steps">
                      <h4>Etapas do Fluxo</h4>
                      
                      <div className="steps-list">
                        {template.steps.map(step => (
                          <div key={step.id} className="step-item">
                            <div className="step-item-header">
                              <div className="step-name">
                                <span className="step-number">{step.order}</span>
                                {step.name}
                              </div>
                              <div className="step-duration">
                                {formatDuration(step.estimatedDuration)}
                              </div>
                            </div>
                            
                            <div className="step-item-content">
                              <div className="step-description">
                                {step.description}
                              </div>
                              
                              <div className="step-details">
                                <div className="detail-row">
                                  <span className="detail-label">Responsáveis:</span>
                                  <span className="detail-value">{step.responsibleRoles.join(', ')}</span>
                                </div>
                                
                                {step.requiredDocuments && step.requiredDocuments.length > 0 && (
                                  <div className="detail-row">
                                    <span className="detail-label">Documentos Necessários:</span>
                                    <span className="detail-value">{step.requiredDocuments.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="workflow-detail-content">
              <div className="detail-tabs">
                <button 
                  className={`tab-btn ${!selectedTemplate ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate(null)}
                >
                  Fluxos Ativos
                </button>
                <button 
                  className={`tab-btn ${selectedTemplate ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedTemplate(templates[0]?.id || null);
                    setSelectedWorkflow(null);
                  }}
                >
                  Modelos de Fluxo
                </button>
              </div>
              
              {!selectedTemplate ? (
                <div className="active-workflows-summary">
                  <h3>Visão Geral dos Fluxos Ativos</h3>
                  
                  <div className="summary-stats">
                    <div className="stat-card">
                      <div className="stat-value">{workflows.length}</div>
                      <div className="stat-label">Total de Fluxos</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">
                        {workflows.filter(wf => wf.status === 'Em andamento').length}
                      </div>
                      <div className="stat-label">Em Andamento</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">
                        {workflows.filter(wf => wf.status === 'Concluído').length}
                      </div>
                      <div className="stat-label">Concluídos</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">
                        {workflows.filter(wf => wf.status === 'Em atraso').length}
                      </div>
                      <div className="stat-label">Em Atraso</div>
                    </div>
                  </div>
                  
                  <div className="summary-message">
                    <p>Selecione um fluxo de trabalho da lista para ver os detalhes ou criar um novo fluxo.</p>
                    <button 
                      className="new-workflow-btn"
                      onClick={() => setShowNewWorkflowForm(true)}
                    >
                      Novo Fluxo de Trabalho
                    </button>
                  </div>
                </div>
              ) : (
                <div className="templates-list">
                  <h3>Modelos de Fluxo Disponíveis</h3>
                  
                  <div className="template-items">
                    {templates.map(template => (
                      <div 
                        key={template.id}
                        className={`template-item ${selectedTemplate === template.id ? 'selected' : ''}`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="template-name">{template.name}</div>
                        <div className="template-type">{template.ensaioType}</div>
                        <div className="template-info">
                          <span className="template-steps">{template.steps.length} etapas</span>
                          <span className="template-duration">
                            {formatDuration(calculateTotalDuration(template))}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de novo fluxo de trabalho */}
      {showNewWorkflowForm && (
        <div className="modal-overlay">
          <div className="new-workflow-modal">
            <div className="modal-header">
              <h3>Novo Fluxo de Trabalho</h3>
              <button 
                className="close-btn"
                onClick={() => setShowNewWorkflowForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={addNewWorkflow}>
              <div className="form-group">
                <label>ID do Ensaio</label>
                <input 
                  type="text"
                  value={newWorkflowData.ensaioId}
                  onChange={(e) => setNewWorkflowData({
                    ...newWorkflowData,
                    ensaioId: e.target.value
                  })}
                  placeholder="Ex: E-1234"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Nome do Ensaio</label>
                <input 
                  type="text"
                  value={newWorkflowData.ensaioName}
                  onChange={(e) => setNewWorkflowData({
                    ...newWorkflowData,
                    ensaioName: e.target.value
                  })}
                  placeholder="Ex: Ensaio de Compressão - Pilar P1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Modelo de Fluxo</label>
                <select 
                  value={newWorkflowData.templateId}
                  onChange={(e) => setNewWorkflowData({
                    ...newWorkflowData,
                    templateId: e.target.value
                  })}
                  required
                >
                  <option value="">Selecione um modelo</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.ensaioType})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowNewWorkflowForm(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={!newWorkflowData.ensaioId || !newWorkflowData.ensaioName || !newWorkflowData.templateId}
                >
                  Criar Fluxo de Trabalho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnsaiosWorkflow;