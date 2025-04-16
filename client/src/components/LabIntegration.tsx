import { useState, useEffect } from 'react';
import '../styles/LabIntegration.css';

// Tipos para equipamentos e integrações
interface LabEquipment {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  type: string;
  status: string;
  lastCalibration: string;
  nextCalibration: string;
  connected: boolean;
}

interface LabConnection {
  id: string;
  equipmentId: string;
  connectionType: string;
  ipAddress?: string;
  port?: string;
  serialPort?: string;
  baudRate?: string;
  status: string;
  lastConnection: string;
}

interface DataImport {
  id: string;
  equipmentId: string;
  date: string;
  status: string;
  ensaioId?: string;
  fileSize?: string;
  recordCount?: number;
}

// Dados de exemplo
const equipmentData: LabEquipment[] = [
  {
    id: 'eq-001',
    name: 'Prensa Hidráulica Digital',
    model: 'PHD-3000',
    manufacturer: 'Controls',
    type: 'Compressão',
    status: 'Calibrado',
    lastCalibration: '10/01/2025',
    nextCalibration: '10/01/2026',
    connected: true
  },
  {
    id: 'eq-002',
    name: 'Gamadensímetro Nuclear',
    model: 'GDN-5000',
    manufacturer: 'Troxler',
    type: 'Densidade',
    status: 'Calibrado',
    lastCalibration: '15/02/2025',
    nextCalibration: '15/02/2026',
    connected: true
  },
  {
    id: 'eq-003',
    name: 'Máquina Universal de Ensaios',
    model: 'MUE-1000',
    manufacturer: 'Shimadzu',
    type: 'Tração/Compressão',
    status: 'Calibrado',
    lastCalibration: '05/03/2025',
    nextCalibration: '05/03/2026',
    connected: false
  },
  {
    id: 'eq-004',
    name: 'Equipamento Ultrassónico',
    model: 'PUNDIT Lab+',
    manufacturer: 'Proceq',
    type: 'Ultrassons',
    status: 'Calibrado',
    lastCalibration: '20/03/2025',
    nextCalibration: '20/03/2026',
    connected: false
  },
  {
    id: 'eq-005',
    name: 'Analisador Granulométrico Digital',
    model: 'SieveScan Pro',
    manufacturer: 'Humboldt',
    type: 'Granulometria',
    status: 'Calibração em Atraso',
    lastCalibration: '12/01/2024',
    nextCalibration: '12/01/2025',
    connected: false
  }
];

const connectionData: LabConnection[] = [
  {
    id: 'conn-001',
    equipmentId: 'eq-001',
    connectionType: 'TCP/IP',
    ipAddress: '192.168.1.100',
    port: '8080',
    status: 'Conectado',
    lastConnection: '16/04/2025 08:45'
  },
  {
    id: 'conn-002',
    equipmentId: 'eq-002',
    connectionType: 'TCP/IP',
    ipAddress: '192.168.1.101',
    port: '8080',
    status: 'Conectado',
    lastConnection: '16/04/2025 09:30'
  },
  {
    id: 'conn-003',
    equipmentId: 'eq-003',
    connectionType: 'Serial',
    serialPort: 'COM3',
    baudRate: '9600',
    status: 'Desconectado',
    lastConnection: '15/04/2025 14:20'
  },
  {
    id: 'conn-004',
    equipmentId: 'eq-004',
    connectionType: 'Serial',
    serialPort: 'COM4',
    baudRate: '9600',
    status: 'Desconectado',
    lastConnection: '14/04/2025 11:10'
  },
  {
    id: 'conn-005',
    equipmentId: 'eq-005',
    connectionType: 'TCP/IP',
    ipAddress: '192.168.1.103',
    port: '8080',
    status: 'Erro de Conexão',
    lastConnection: '10/04/2025 16:45'
  }
];

const importData: DataImport[] = [
  {
    id: 'imp-001',
    equipmentId: 'eq-001',
    date: '16/04/2025 08:50',
    status: 'Concluído',
    ensaioId: 'E-2342',
    fileSize: '1.2 MB',
    recordCount: 12
  },
  {
    id: 'imp-002',
    equipmentId: 'eq-002',
    date: '16/04/2025 09:45',
    status: 'Concluído',
    ensaioId: 'E-2345',
    fileSize: '0.8 MB',
    recordCount: 8
  },
  {
    id: 'imp-003',
    equipmentId: 'eq-001',
    date: '15/04/2025 14:30',
    status: 'Concluído',
    ensaioId: 'E-2330',
    fileSize: '1.5 MB',
    recordCount: 15
  },
  {
    id: 'imp-004',
    equipmentId: 'eq-003',
    date: '15/04/2025 14:25',
    status: 'Erro',
    fileSize: '0.5 MB',
    recordCount: 0
  },
  {
    id: 'imp-005',
    equipmentId: 'eq-002',
    date: '14/04/2025 16:40',
    status: 'Concluído',
    ensaioId: 'E-2325',
    fileSize: '0.9 MB',
    recordCount: 10
  }
];

// Formatos de arquivo suportados por tipo de equipamento
const supportedFormats: Record<string, string[]> = {
  'Compressão': ['.dat', '.csv', '.txt', '.xlsx'],
  'Tração/Compressão': ['.dat', '.csv', '.txt', '.xlsx'],
  'Densidade': ['.csv', '.txt', '.xlsm'],
  'Ultrassons': ['.dat', '.csv'],
  'Granulometria': ['.csv', '.xlsx', '.json']
};

const LabIntegration = () => {
  const [equipment, setEquipment] = useState<LabEquipment[]>(equipmentData);
  const [connections, setConnections] = useState<LabConnection[]>(connectionData);
  const [imports, setImports] = useState<DataImport[]>(importData);
  const [activeTab, setActiveTab] = useState<string>('equipment');
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [showConnectionForm, setShowConnectionForm] = useState<boolean>(false);
  const [connectionForm, setConnectionForm] = useState({
    equipmentId: '',
    connectionType: 'TCP/IP',
    ipAddress: '',
    port: '',
    serialPort: '',
    baudRate: '9600'
  });

  // Filtrar conexões por equipamento selecionado
  const filteredConnections = selectedEquipment 
    ? connections.filter(conn => conn.equipmentId === selectedEquipment)
    : connections;
  
  // Filtrar importações por equipamento selecionado
  const filteredImports = selectedEquipment
    ? imports.filter(imp => imp.equipmentId === selectedEquipment)
    : imports;
  
  // Selecionar equipamento
  const handleEquipmentSelect = (id: string) => {
    setSelectedEquipment(id === selectedEquipment ? null : id);
  };
  
  // Atualizar formulário de conexão
  const updateConnectionForm = (field: string, value: string) => {
    setConnectionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Abrir formulário de conexão
  const openConnectionForm = (equipmentId: string) => {
    setConnectionForm({
      ...connectionForm,
      equipmentId
    });
    setShowConnectionForm(true);
  };
  
  // Conectar equipamento
  const connectEquipment = (equipmentId: string) => {
    setIsConnecting(true);
    
    // Simulação de conexão
    setTimeout(() => {
      const updatedEquipment = equipment.map(eq => {
        if (eq.id === equipmentId) {
          return { ...eq, connected: true };
        }
        return eq;
      });
      
      const updatedConnections = connections.map(conn => {
        if (conn.equipmentId === equipmentId) {
          return { 
            ...conn, 
            status: 'Conectado',
            lastConnection: new Date().toLocaleString('pt-PT', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          };
        }
        return conn;
      });
      
      setEquipment(updatedEquipment);
      setConnections(updatedConnections);
      setIsConnecting(false);
    }, 2000);
  };
  
  // Desconectar equipamento
  const disconnectEquipment = (equipmentId: string) => {
    setIsConnecting(true);
    
    // Simulação de desconexão
    setTimeout(() => {
      const updatedEquipment = equipment.map(eq => {
        if (eq.id === equipmentId) {
          return { ...eq, connected: false };
        }
        return eq;
      });
      
      const updatedConnections = connections.map(conn => {
        if (conn.equipmentId === equipmentId) {
          return { 
            ...conn, 
            status: 'Desconectado',
            lastConnection: new Date().toLocaleString('pt-PT', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          };
        }
        return conn;
      });
      
      setEquipment(updatedEquipment);
      setConnections(updatedConnections);
      setIsConnecting(false);
    }, 1000);
  };
  
  // Adicionar nova conexão
  const addConnection = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newConnection: LabConnection = {
      id: `conn-${Date.now()}`,
      equipmentId: connectionForm.equipmentId,
      connectionType: connectionForm.connectionType,
      ipAddress: connectionForm.connectionType === 'TCP/IP' ? connectionForm.ipAddress : undefined,
      port: connectionForm.connectionType === 'TCP/IP' ? connectionForm.port : undefined,
      serialPort: connectionForm.connectionType === 'Serial' ? connectionForm.serialPort : undefined,
      baudRate: connectionForm.connectionType === 'Serial' ? connectionForm.baudRate : undefined,
      status: 'Aguardando conexão',
      lastConnection: '-'
    };
    
    setConnections([...connections, newConnection]);
    setShowConnectionForm(false);
    setConnectionForm({
      equipmentId: '',
      connectionType: 'TCP/IP',
      ipAddress: '',
      port: '',
      serialPort: '',
      baudRate: '9600'
    });
  };
  
  // Importar dados
  const importData = (equipmentId: string) => {
    setIsImporting(true);
    
    // Simulação de importação
    setTimeout(() => {
      const newImport: DataImport = {
        id: `imp-${Date.now()}`,
        equipmentId,
        date: new Date().toLocaleString('pt-PT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'Concluído',
        ensaioId: `E-${Math.floor(Math.random() * 1000) + 2000}`,
        fileSize: `${(Math.random() * 2).toFixed(1)} MB`,
        recordCount: Math.floor(Math.random() * 20) + 1
      };
      
      setImports([newImport, ...imports]);
      setIsImporting(false);
      
      // Mostrar notificação
      alert(`Importação concluída com sucesso!\nEnsaio ID: ${newImport.ensaioId}\nRegistos: ${newImport.recordCount}`);
    }, 3000);
  };
  
  // Encontrar equipamento por ID
  const getEquipmentById = (id: string) => {
    return equipment.find(eq => eq.id === id);
  };
  
  return (
    <div className="lab-integration">
      <div className="integration-header">
        <h2>Integração Laboratorial</h2>
        <div className="integration-tabs">
          <button 
            className={`tab-btn ${activeTab === 'equipment' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipment')}
          >
            Equipamentos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'connections' ? 'active' : ''}`}
            onClick={() => setActiveTab('connections')}
          >
            Conexões
          </button>
          <button 
            className={`tab-btn ${activeTab === 'imports' ? 'active' : ''}`}
            onClick={() => setActiveTab('imports')}
          >
            Importações
          </button>
        </div>
      </div>
      
      <div className="integration-content">
        {activeTab === 'equipment' && (
          <div className="equipment-tab">
            <div className="tab-toolbar">
              <h3>Equipamentos Laboratoriais</h3>
              <div className="toolbar-actions">
                <button className="add-btn">Adicionar Equipamento</button>
              </div>
            </div>
            
            <div className="equipment-list">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Modelo</th>
                    <th>Fabricante</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Última Calibração</th>
                    <th>Próxima Calibração</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map(eq => (
                    <tr 
                      key={eq.id} 
                      className={selectedEquipment === eq.id ? 'selected-row' : ''}
                      onClick={() => handleEquipmentSelect(eq.id)}
                    >
                      <td>{eq.name}</td>
                      <td>{eq.model}</td>
                      <td>{eq.manufacturer}</td>
                      <td>{eq.type}</td>
                      <td>
                        <span className={`status-pill ${
                          eq.status === 'Calibrado' 
                            ? 'status-success' 
                            : 'status-danger'
                        }`}>
                          {eq.status}
                        </span>
                      </td>
                      <td>{eq.lastCalibration}</td>
                      <td>{eq.nextCalibration}</td>
                      <td>
                        <span className={`connection-status ${
                          eq.connected ? 'connected' : 'disconnected'
                        }`}>
                          {eq.connected ? 'Conectado' : 'Desconectado'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        {eq.connected ? (
                          <>
                            <button 
                              className="disconnect-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                disconnectEquipment(eq.id);
                              }}
                              disabled={isConnecting}
                            >
                              Desconectar
                            </button>
                            <button 
                              className="import-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                importData(eq.id);
                              }}
                              disabled={isImporting}
                            >
                              Importar Dados
                            </button>
                          </>
                        ) : (
                          <button 
                            className="connect-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              connectEquipment(eq.id);
                            }}
                            disabled={isConnecting}
                          >
                            Conectar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {selectedEquipment && (
              <div className="equipment-details">
                <h4>Detalhes do Equipamento</h4>
                
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Formatos Suportados:</span>
                    <span className="detail-value">
                      {supportedFormats[getEquipmentById(selectedEquipment)?.type || '']?.join(', ') || 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Última Importação:</span>
                    <span className="detail-value">
                      {imports.find(imp => imp.equipmentId === selectedEquipment)?.date || 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Número de Conexões:</span>
                    <span className="detail-value">
                      {connections.filter(conn => conn.equipmentId === selectedEquipment).length}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total de Importações:</span>
                    <span className="detail-value">
                      {imports.filter(imp => imp.equipmentId === selectedEquipment).length}
                    </span>
                  </div>
                </div>
                
                <div className="details-actions">
                  <button 
                    className="new-connection-btn"
                    onClick={() => openConnectionForm(selectedEquipment)}
                  >
                    Nova Conexão
                  </button>
                  <button className="edit-equipment-btn">
                    Editar Equipamento
                  </button>
                  <button className="calibration-btn">
                    Registar Calibração
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'connections' && (
                      <div className="connections-tab">
            <div className="tab-toolbar">
              <h3>Conexões de Equipamentos</h3>
              <div className="toolbar-actions">
                <button 
                  className="add-btn"
                  onClick={() => setShowConnectionForm(true)}
                >
                  Nova Conexão
                </button>
              </div>
            </div>
            
            <div className="connections-list">
              <table>
                <thead>
                  <tr>
                    <th>Equipamento</th>
                    <th>Tipo de Conexão</th>
                    <th>Detalhes</th>
                    <th>Estado</th>
                    <th>Última Conexão</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConnections.map(conn => {
                    const eq = getEquipmentById(conn.equipmentId);
                    return (
                      <tr key={conn.id}>
                        <td>{eq?.name || 'Desconhecido'}</td>
                        <td>{conn.connectionType}</td>
                        <td>
                          {conn.connectionType === 'TCP/IP' 
                            ? `${conn.ipAddress}:${conn.port}`
                            : `${conn.serialPort} @ ${conn.baudRate} baud`
                          }
                        </td>
                        <td>
                          <span className={`status-pill ${
                            conn.status === 'Conectado' 
                              ? 'status-success' 
                              : conn.status === 'Erro de Conexão'
                                ? 'status-danger'
                                : 'status-warning'
                          }`}>
                            {conn.status}
                          </span>
                        </td>
                        <td>{conn.lastConnection}</td>
                        <td className="actions-cell">
                          <button className="edit-btn">Editar</button>
                          <button className="delete-btn">Remover</button>
                          {conn.status !== 'Conectado' && (
                            <button 
                              className="connect-btn"
                              onClick={() => connectEquipment(conn.equipmentId)}
                              disabled={isConnecting}
                            >
                              Testar Conexão
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredConnections.length === 0 && (
                <div className="empty-state">
                  <p>Nenhuma conexão encontrada.</p>
                  {selectedEquipment && (
                    <button 
                      className="add-connection-btn"
                      onClick={() => openConnectionForm(selectedEquipment)}
                    >
                      Adicionar Conexão para {getEquipmentById(selectedEquipment)?.name}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'imports' && (
          <div className="imports-tab">
            <div className="tab-toolbar">
              <h3>Histórico de Importações</h3>
            </div>
            
            <div className="imports-list">
              <table>
                <thead>
                  <tr>
                    <th>Data/Hora</th>
                    <th>Equipamento</th>
                    <th>ID do Ensaio</th>
                    <th>Tamanho</th>
                    <th>Registos</th>
                    <th>Estado</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredImports.map(imp => {
                    const eq = getEquipmentById(imp.equipmentId);
                    return (
                      <tr key={imp.id}>
                        <td>{imp.date}</td>
                        <td>{eq?.name || 'Desconhecido'}</td>
                        <td>{imp.ensaioId || '-'}</td>
                        <td>{imp.fileSize || '-'}</td>
                        <td>{imp.recordCount || 0}</td>
                        <td>
                          <span className={`status-pill ${
                            imp.status === 'Concluído' 
                              ? 'status-success' 
                              : 'status-danger'
                          }`}>
                            {imp.status}
                          </span>
                        </td>
                        <td className="actions-cell">
                          {imp.ensaioId ? (
                            <button className="view-btn">
                              Ver Ensaio
                            </button>
                          ) : (
                            <button className="retry-btn">
                              Repetir
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredImports.length === 0 && (
                <div className="empty-state">
                  <p>Nenhuma importação encontrada.</p>
                  {selectedEquipment && getEquipmentById(selectedEquipment)?.connected && (
                    <button 
                      className="import-btn"
                      onClick={() => importData(selectedEquipment)}
                      disabled={isImporting}
                    >
                      Importar Dados de {getEquipmentById(selectedEquipment)?.name}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Formulário de nova conexão */}
      {showConnectionForm && (
        <div className="modal-overlay">
          <div className="connection-form-modal">
            <div className="modal-header">
              <h3>Nova Conexão</h3>
              <button 
                className="close-btn"
                onClick={() => setShowConnectionForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={addConnection}>
              <div className="form-group">
                <label>Equipamento</label>
                <select 
                  value={connectionForm.equipmentId}
                  onChange={(e) => updateConnectionForm('equipmentId', e.target.value)}
                  required
                >
                  <option value="">Selecione um equipamento</option>
                  {equipment.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Tipo de Conexão</label>
                <select 
                  value={connectionForm.connectionType}
                  onChange={(e) => updateConnectionForm('connectionType', e.target.value)}
                  required
                >
                  <option value="TCP/IP">TCP/IP</option>
                  <option value="Serial">Serial</option>
                </select>
              </div>
              
              {connectionForm.connectionType === 'TCP/IP' ? (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Endereço IP</label>
                      <input 
                        type="text"
                        value={connectionForm.ipAddress}
                        onChange={(e) => updateConnectionForm('ipAddress', e.target.value)}
                        placeholder="Ex: 192.168.1.100"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Porta</label>
                      <input 
                        type="text"
                        value={connectionForm.port}
                        onChange={(e) => updateConnectionForm('port', e.target.value)}
                        placeholder="Ex: 8080"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Porta Serial</label>
                      <input 
                        type="text"
                        value={connectionForm.serialPort}
                        onChange={(e) => updateConnectionForm('serialPort', e.target.value)}
                        placeholder="Ex: COM3"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Baud Rate</label>
                      <select 
                        value={connectionForm.baudRate}
                        onChange={(e) => updateConnectionForm('baudRate', e.target.value)}
                        required
                      >
                        <option value="9600">9600</option>
                        <option value="19200">19200</option>
                        <option value="38400">38400</option>
                        <option value="57600">57600</option>
                        <option value="115200">115200</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowConnectionForm(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Overlay de operação em andamento */}
      {(isConnecting || isImporting) && (
        <div className="operation-overlay">
          <div className="operation-modal">
            <div className="loading-spinner"></div>
            <p>
              {isConnecting 
                ? 'A estabelecer conexão com o equipamento...' 
                : 'A importar dados do equipamento...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabIntegration;