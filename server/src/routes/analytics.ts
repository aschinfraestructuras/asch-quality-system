
import express from 'express';
const router = express.Router();

router.get('/', (_req, res) => {
  try {
    res.status(200).json({
      message: '✅ Analytics ligado com sucesso!',
      projects: [
        { 
          id: '1', 
          name: 'Obra Teste', 
          status: 'ativo', 
          start_date: new Date().toISOString(), 
          completion: 40, 
          created_at: new Date().toISOString(), 
          updated_at: new Date().toISOString() 
        }
      ],
      nonConformities: [
        { 
          id: 'n1', 
          project_id: '1', 
          title: 'NC1', 
          status: 'aberta', 
          severity: 'alta', 
          category: 'execução', 
          date: new Date().toISOString(), 
          created_at: new Date().toISOString(), 
          updated_at: new Date().toISOString() 
        }
      ],
      checklists: [],
      documents: [],
      materials: [],
      tests: [],
      works: [],
      kpiData: {
        strategic: {
          totalProjects: 1,
          activeProjects: 1,
          totalNonConformities: 1,
          openNonConformities: 1,
          documentsComplianceRate: 95,
          overallQualityScore: 85
        },
        technical: {
          totalTests: 10,
          pendingTests: 2,
          failedTests: 1,
          checklistCompletion: 60,
          nonConformitiesByCategory: { execução: 1 }
        },
        inspection: {
          pendingInspections: 2,
          completedInspections: 5,
          inspectionComplianceRate: 88,
          criticalNonConformities: 0
        },
        materials: {
          totalMaterials: 10,
          materialsWithCertification: 9,
          pendingMaterialApprovals: 1,
          rejectedMaterials: 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro interno do servidor', 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    });
  }
});

export default router;