
// services/offlineService.ts
import { v4 as uuidv4 } from 'uuid'; 

// Chave para armazenar operações pendentes
const PENDING_OPERATIONS_KEY = 'sgq_pending_operations';

// Interface para operações pendentes
export interface PendingOperation {
  id: string;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
  attempts: number;
}

// Função para obter todas as operações pendentes
export const getPendingOperations = async (): Promise<PendingOperation[]> => {
  try {
    const operationsJson = localStorage.getItem(PENDING_OPERATIONS_KEY);
    
    if (!operationsJson) {
      return [];
    }
    
    return JSON.parse(operationsJson);
  } catch (error) {
    console.error('Erro ao obter operações pendentes:', error);
    return [];
  }
};

// Função para adicionar uma operação pendente
export const addPendingOperation = async (
  table: string,
  operation: 'insert' | 'update' | 'delete',
  data: any
): Promise<void> => {
  try {
    const operations = await getPendingOperations();
    
    const newOperation: PendingOperation = {
      id: uuidv4(),
      table,
      operation,
      data,
      timestamp: Date.now(),
      attempts: 0
    };
    
    operations.push(newOperation);
    localStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(operations));
  } catch (error) {
    console.error(`Erro ao adicionar operação pendente (${operation} em ${table}):`, error);
    throw error;
  }
};

// Função para remover uma operação pendente
export const removePendingOperation = async (operationId: string): Promise<void> => {
  try {
    const operations = await getPendingOperations();
    const updatedOperations = operations.filter(op => op.id !== operationId);
    
    localStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(updatedOperations));
  } catch (error) {
    console.error(`Erro ao remover operação pendente (ID: ${operationId}):`, error);
    throw error;
  }
};

// Função para atualizar uma operação pendente
export const updatePendingOperation = async (operation: PendingOperation): Promise<void> => {
  try {
    const operations = await getPendingOperations();
    const operationIndex = operations.findIndex(op => op.id === operation.id);
    
    if (operationIndex === -1) {
      throw new Error(`Operação não encontrada (ID: ${operation.id})`);
    }
    
    operations[operationIndex] = operation;
    localStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(operations));
  } catch (error) {
    console.error(`Erro ao atualizar operação pendente (ID: ${operation.id}):`, error);
    throw error;
  }
};

// Função para verificar se existem operações pendentes
export const hasPendingOperations = async (): Promise<boolean> => {
  const operations = await getPendingOperations();
  return operations.length > 0;
};

// Função para armazenar dados em cache localmente
export const storeLocalData = async (key: string, data: any, expiryMinutes: number = 60): Promise<void> => {
  try {
    const item = {
      data,
      expiry: Date.now() + (expiryMinutes * 60 * 1000)
    };
    
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(`Erro ao armazenar dados localmente (${key}):`, error);
    throw error;
  }
};

// Função para obter dados em cache localmente
export const getLocalData = async <T>(key: string): Promise<T | null> => {
  try {
    const itemJson = localStorage.getItem(key);
    
    if (!itemJson) {
      return null;
    }
    
    const item = JSON.parse(itemJson);
    const now = Date.now();
    
    // Verificar se os dados expiraram
    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.data as T;
  } catch (error) {
    console.error(`Erro ao obter dados locais (${key}):`, error);
    return null;
  }
};

// Função para limpar todos os dados em cache localmente
export const clearLocalData = async (): Promise<void> => {
  try {
    // Não limpar operações pendentes
    const pendingOperations = await getPendingOperations();
    
    // Limpar todo o localStorage
    localStorage.clear();
    
    // Restaurar operações pendentes
    if (pendingOperations.length > 0) {
      localStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(pendingOperations));
    }
  } catch (error) {
    console.error('Erro ao limpar dados locais:', error);
    throw error;
  }
};

// Exportar todas as funções
export const offlineService = {
  getPendingOperations,
  addPendingOperation,
  removePendingOperation,
  updatePendingOperation,
  hasPendingOperations,
  storeLocalData,
  getLocalData,
  clearLocalData
};

export default offlineService;
