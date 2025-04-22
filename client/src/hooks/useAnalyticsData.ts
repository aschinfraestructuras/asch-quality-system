// hooks/useAnalyticsData.ts
import { useEffect, useState } from 'react';
import { DashboardData } from '../interfaces/dashboardTypes';

const useAnalyticsData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [modoSimulado, setModoSimulado] = useState<boolean>(false);

  const fetchDadosAPI = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/analytics');
      if (!res.ok) throw new Error('Erro ao buscar dados da API');
      const json: DashboardData = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchDadosSimulados = async () => {
    try {
      setLoading(true);
      const fallback: DashboardData = {
        projects: [],
        works: [],
        checklists: [],
        tests: [],
        nonConformities: [],
        documents: [],
        materials: [],
        kpiData: {
          strategic: {
            totalProjects: 7,
            activeProjects: 4,
            totalNonConformities: 12,
            openNonConformities: 5,
            documentsComplianceRate: 89,
            overallQualityScore: 92
          },
          technical: {
            totalTests: 24,
            pendingTests: 6,
            failedTests: 2,
            checklistCompletion: 84,
            nonConformitiesByCategory: {
              Execução: 3,
              Materiais: 2,
              Projeto: 1
            }
          },
          inspection: {
            pendingInspections: 2,
            completedInspections: 8,
            inspectionComplianceRate: 85,
            criticalNonConformities: 1
          },
          materials: {
            totalMaterials: 140,
            materialsWithCertification: 86,
            pendingMaterialApprovals: 9,
            rejectedMaterials: 3
          }
        }
      };
      setData(fallback);
      setError(null);
    } catch (err: any) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    modoSimulado ? fetchDadosSimulados() : fetchDadosAPI();
  }, [modoSimulado]);

  return { data, loading, error, modoSimulado, setModoSimulado };
};

export default useAnalyticsData;
