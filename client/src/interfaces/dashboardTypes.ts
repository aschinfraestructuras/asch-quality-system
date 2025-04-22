// Criar ficheiro de interfaces
// interfaces/dashboardTypes.ts

// Papéis de utilizador
export type UserRole = 'manager' | 'engineer' | 'inspector' | 'warehouse';

// Modos do dashboard
export type DashboardMode = 'online' | 'offline';

// Interface para filtros
export interface DashboardFilter {
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  projects: {
    id: string;
    name: string;
  }[];
  status: string[];
  categories: string[];
  searchTerm: string;
  sortBy: string;
}

// Interfaces para os tipos de dados principais
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  start_date: string;
  end_date?: string;
  completion: number;
  target?: number;
  client?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Work {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  status: string;
  start_date: string;
  end_date?: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  project_id: string;
  work_id?: string;
  title: string;
  description?: string;
  status: string;
  due_date?: string;
  is_compliant: boolean;
  created_at: string;
  updated_at: string;
  assignee?: string;
}

export interface Test {
  id: string;
  project_id: string;
  work_id?: string;
  title: string;
  description?: string;
  status: string;
  date?: string;
  result?: string;
  created_at: string;
  updated_at: string;
  performed_by?: string;
}

export interface NonConformity {
  id: string;
  project_id: string;
  work_id?: string;
  title: string;
  description?: string;
  status: string;
  severity: string;
  category: string;
  date: string;
  resolution_date?: string;
  created_at: string;
  updated_at: string;
  reported_by?: string;
}

export interface Document {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  category: string;
  file_path: string;
  version: string;
  is_compliant: boolean;
  created_at: string;
  updated_at: string;
  uploaded_by?: string;
}

export interface Material {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  material_type: string;
  supplier?: string;
  quantity: number;
  unit: string;
  status: string;
  has_certification: boolean;
  certification_number?: string;
  created_at: string;
  updated_at: string;
}

// Interface para os dados completos do dashboard
export interface DashboardData {
  projects: Project[];
  works: Work[];
  checklists: ChecklistItem[];
  tests: Test[];
  nonConformities: NonConformity[];
  documents: Document[];
  materials: Material[];
  kpiData: {
    strategic: {
      totalProjects: number;
      activeProjects: number;
      totalNonConformities: number;
      openNonConformities: number;
      documentsComplianceRate: number;
      overallQualityScore: number;
    };
    technical: {
      totalTests: number;
      pendingTests: number;
      failedTests: number;
      checklistCompletion: number;
      nonConformitiesByCategory: Record<string, number>;
    };
    inspection: {
      pendingInspections: number;
      completedInspections: number;
      inspectionComplianceRate: number;
      criticalNonConformities: number;
    };
    materials: {
      totalMaterials: number;
      materialsWithCertification: number;
      pendingMaterialApprovals: number;
      rejectedMaterials: number;
    };
  };
}

// Interface para atividades recentes
export interface Activity {
  id: string;
  type: 'nonconformity' | 'document' | 'checklist' | 'test' | 'material';
  title: string;
  date: Date;
  project: string;
  status: string;
  user?: string;
}

// Interface para notificações
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  date: Date;
  read: boolean;
  link?: string;
  relatedEntity?: {
    type: 'document' | 'checklist' | 'nonconformity' | 'material' | 'test';
    id: string;
  };
}
