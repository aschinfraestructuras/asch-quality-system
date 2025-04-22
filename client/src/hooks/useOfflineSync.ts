// hooks/useOfflineSync.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { offlineService } from '../services/offlineService';

export interface PendingOperation {
  id: string;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
  attempts: number;
}

function useOfflineSync() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingOperations, setPendingOperations] = useState<number>(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<Error | null>(null);

  // Função para atualizar o estado online/offline
  const updateOnlineStatus = useCallback(() => {
    setIsOnline(navigator.onLine);
  }, []);

  // Carregar operações pendentes do armazenamento local
  const loadPendingOperations = useCallback(async () => {
    const operations = await offlineService.getPendingOperations();
    setPendingOperations(operations.length);
    return operations;
  }, []);

  // Função para adicionar uma operação pendente
  const addPendingOperation = useCallback(async (
    table: string, 
    operation: 'insert' | 'update' | 'delete',
    data: any
  ) => {
    await offlineService.addPendingOperation(table, operation, data);
    // Atualizar o contador de operações pendentes
    const operations = await offlineService.getPendingOperations();
    setPendingOperations(operations.length);
  }, []);

  // Função principal para sincronizar dados
  const syncData = useCallback(async (force: boolean = false) => {
    // Não sincronizar se não estiver online e não for forçado
    if (!isOnline && !force) {
      return { success: false, error: new Error('Dispositivo offline') };
    }

    // Não sincronizar se já estiver a sincronizar
    if (isSyncing) {
      return { success: false, error: new Error('Sincronização já em andamento') };
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      // Carregar operações pendentes
      const operations = await loadPendingOperations();
      
      if (operations.length === 0) {
        setLastSyncTime(new Date());
        return { success: true, message: 'Sem operações pendentes para sincronizar' };
      }

      // Processar operações em lote usando transações quando possível
      const results = await Promise.allSettled(
        operations.map(async (op) => {
          try {
            switch (op.operation) {
              case 'insert':
                const { data: insertData, error: insertError } = await supabase
                  .from(op.table)
                  .insert(op.data);
                
                if (insertError) throw insertError;
                return { success: true, operation: op, data: insertData };
              
              case 'update':
                const { data: updateData, error: updateError } = await supabase
                  .from(op.table)
                  .update(op.data)
                  .match({ id: op.data.id });
                
                if (updateError) throw updateError;
                return { success: true, operation: op, data: updateData };
              
              case 'delete':
                const { data: deleteData, error: deleteError } = await supabase
                  .from(op.table)
                  .delete()
                  .match({ id: op.data.id });
                
                if (deleteError) throw deleteError;
                return { success: true, operation: op, data: deleteData };
              
              default:
                throw new Error(`Operação desconhecida: ${op.operation}`);
            }
          } catch (error) {
            // Incrementar contagem de tentativas
            const updatedOp = {
              ...op,
              attempts: op.attempts + 1
            };
            
            // Se exceder o número máximo de tentativas, remover a operação
            if (updatedOp.attempts >= 5) {
              await offlineService.removePendingOperation(op.id);
              throw new Error(`Operação excluída após 5 tentativas: ${error}`);
            } else {
              // Atualizar o número de tentativas
              await offlineService.updatePendingOperation(updatedOp);
              throw error;
            }
          }
        })
      );

      // Processar resultados
      const successfulOps = results.filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<any>[];
      const failedOps = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];

      // Remover operações bem-sucedidas
      await Promise.all(
        successfulOps.map(r => offlineService.removePendingOperation(r.value.operation.id))
      );

     // Atualizar contador de operações pendentes
     const remainingOps = await offlineService.getPendingOperations();
     setPendingOperations(remainingOps.length);

     // Atualizar tempo da última sincronização
     setLastSyncTime(new Date());

     // Se houver falhas, lançar erro
     if (failedOps.length > 0) {
       throw new Error(`${failedOps.length} operações falharam na sincronização`);
     }

     return { 
       success: true, 
       message: `${successfulOps.length} operações sincronizadas com sucesso` 
     };
   } catch (error) {
     console.error('Erro na sincronização:', error);
     setSyncError(error instanceof Error ? error : new Error(String(error)));
     return { success: false, error };
   } finally {
     setIsSyncing(false);
   }
 }, [isOnline, isSyncing, loadPendingOperations]);

 // Função para forçar sincronização
 const syncNow = useCallback(async () => {
   return syncData(true);
 }, [syncData]);

 // Executar dados quando mudar status online/offline
 useEffect(() => {
   // Agendar sincronização quando voltar a estar online
   if (isOnline && pendingOperations > 0) {
     syncData();
   }
 }, [isOnline, pendingOperations, syncData]);

 // Atualização automática de status online/offline
 useEffect(() => {
   window.addEventListener('online', updateOnlineStatus);
   window.addEventListener('offline', updateOnlineStatus);
   
   // Verificar operações pendentes inicialmente
   loadPendingOperations();
   
   return () => {
     window.removeEventListener('online', updateOnlineStatus);
     window.removeEventListener('offline', updateOnlineStatus);
   };
 }, [updateOnlineStatus, loadPendingOperations]);

 // Sincronização periódica quando online
 useEffect(() => {
   let intervalId: number;
   
   if (isOnline && pendingOperations > 0) {
     intervalId = window.setInterval(() => {
       syncData();
     }, 1 * 60 * 1000); // Tentar sincronizar a cada 1 minuto
   }
   
   return () => {
     if (intervalId) {
       window.clearInterval(intervalId);
     }
   };
 }, [isOnline, pendingOperations, syncData]);

 return {
   isOnline,
   isSyncing,
   pendingOperations,
   lastSyncTime,
   syncError,
   syncNow,
   addPendingOperation
 };
}

// Exportação default adicionada
export default useOfflineSync;

// Manter exportação nomeada para compatibilidade
export { useOfflineSync };