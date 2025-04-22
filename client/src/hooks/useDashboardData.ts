// hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

// Toggle entre dados mock e dados reais do Supabase
const useMockData = true;

// Tipos
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'in_progress';
export type OperationType = 'insert' | 'update' | 'delete';

export interface BaseEntity {
  id: string;
  name?: string;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Project extends BaseEntity {
  description?: string;
}

export interface Work extends BaseEntity {
  projectId: string;
}

export interface NonConformity extends BaseEntity {
  category?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
}

export interface Material extends BaseEntity {
  hasCertification: boolean;
  category?: string;
}

export interface Document extends BaseEntity {
  title: string;
  isCompliant: boolean;
}

export interface Test extends BaseEntity {
  result?: 'passed' | 'failed' | 'pending';
}

export interface ChecklistItem extends BaseEntity {
  isCompliant: boolean;
}

export interface DashboardData {
  projects?: Project[];
  works?: Work[];
  nonConformities?: NonConformity[];
  materials?: Material[];
  documents?: Document[];
  tests?: Test[];
  checklists?: ChecklistItem[];
  kpiData?: {
    strategic?: Record<string, number>;
    technical?: {
      totalTests: number;
      pendingTests: number;
      failedTests: number;
      checklistCompletion: number;
      nonConformitiesByCategory: Record<string, number>;
    };
    inspection?: Record<string, number>;
    materials?: Record<string, number>;
  };
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let projects: Project[] = [];
      let works: Work[] = [];
      let nonConformities: NonConformity[] = [];
      let materials: Material[] = [];
      let documents: Document[] = [];
      let tests: Test[] = [];
      let checklists: ChecklistItem[] = [];

      if (useMockData) {
        projects = [
          { id: 'p1', name: 'Viaduto Norte', status: 'active' },
          { id: 'p2', name: 'Estação Central', status: 'completed' }
        ];

        works = [
          { id: 'w1', name: 'Fundação', status: 'completed', projectId: 'p1' }
        ];

        nonConformities = [
          { id: 'nc-1', status: 'pending', category: 'Segurança', severity: 'medium' },
          { id: 'nc-2', status: 'completed', category: 'Materiais', severity: 'high' }
        ];

        materials = [
          { id: 'm1', name: 'Betão C30/37', status: 'active', hasCertification: true },
          { id: 'm2', name: 'Aço B500', status: 'active', hasCertification: false }
        ];

        documents = [
          { id: 'd1', title: 'Procedimento de Qualidade', isCompliant: true, status: 'active' },
          { id: 'd2', title: 'Plano de Segurança', isCompliant: false, status: 'inactive' }
        ];

        tests = [
          { id: 't1', status: 'completed', result: 'passed' },
          { id: 't2', status: 'completed', result: 'failed' },
          { id: 't3', status: 'pending', result: 'pending' }
        ];

        checklists = [
          { id: 'c1', status: 'completed', isCompliant: true },
          { id: 'c2', status: 'completed', isCompliant: false }
        ];
      } else {
        const fetchTable = async (table: string) => {
          const { data, error } = await supabase.from(table).select('*');
          if (error) throw new Error(`Erro ao buscar ${table}: ${error.message}`);
          return data || [];
        };

        [projects, works, nonConformities, materials, documents, tests, checklists] = await Promise.all([
          fetchTable('projetos'),
          fetchTable('obras'),
          fetchTable('nao_conformidades'),
          fetchTable('materiais'),
          fetchTable('documentos'),
          fetchTable('ensaios'),
          fetchTable('checklist_items')
        ]);
      }

      const kpiData = {
        strategic: {
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'active').length,
          totalNonConformities: nonConformities.length,
          openNonConformities: nonConformities.filter(nc => nc.status === 'pending').length,
          documentsComplianceRate: Math.round(
            (documents.filter(d => d.isCompliant).length / documents.length) * 100 || 0
          ),
          overallQualityScore: 87
        },
        technical: {
          totalTests: tests.length,
          pendingTests: tests.filter(t => t.result === 'pending').length,
          failedTests: tests.filter(t => t.result === 'failed').length,
          checklistCompletion: Math.round(
            (checklists.filter(c => c.isCompliant).length / checklists.length) * 100 || 0
          ),
          nonConformitiesByCategory: nonConformities.reduce((acc, nc) => {
            const cat = nc.category || 'Outros';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        },
        inspection: {
          pendingInspections: 4,
          completedInspections: 12,
          inspectionComplianceRate: 85,
          criticalNonConformities: nonConformities.filter(nc => nc.severity === 'critical').length
        },
        materials: {
          totalMaterials: materials.length,
          materialsWithCertification: materials.filter(m => m.hasCertification).length,
          pendingMaterialApprovals: 1,
          rejectedMaterials: 1
        }
      };

      const dashboardData: DashboardData = {
        projects,
        works,
        nonConformities,
        materials,
        documents,
        tests,
        checklists,
        kpiData
      };

      setData(dashboardData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    lastUpdate,
    refreshData: fetchDashboardData
  };
}

export default useDashboardData;

