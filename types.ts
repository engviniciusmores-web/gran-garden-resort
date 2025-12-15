
export type ViewState = 'LOGIN' | 'PROJECT_SELECT' | 'DASHBOARD' | 'DAILY_LOG' | 'PLANNING' | 'MATERIALS' | 'PEOPLE' | 'LESSONS_LEARNED' | 'REPORTS' | 'DATABASE' | 'BIM_VIEWER' | 'PROJECTS' | 'PHOTOS' | 'HISTORY';

export interface Project {
  id: string;
  name: string;
  location: string;
  status: 'Em Andamento' | 'Finalizada' | 'Atrasada' | 'A Iniciar';
  progress: number;
  // Campos técnicos
  area: number; // m²
  concreteVolume: number; // m³
  teamName: string;
  teamMembers: string;
  budgetTotal?: number; // Valor total do orçamento
  imageUrl?: string; // URL da foto do projeto
}

export interface Task {
  id: string;
  name: string;
  deadline: string;
  status: 'A Fazer' | 'Em Andamento' | 'Em Andamento - Inicial' | 'Em Andamento - Avançado' | 'Concluído' | 'Atrasado';
  responsible: string;
  plannedStart?: string; // Data planejada de início
  plannedEnd?: string; // Data planejada de término
  actualStart?: string; // Data real de início
  actualEnd?: string; // Data real de término
  progress?: number; // Percentual de conclusão (0-100)
  // CAMPOS FINANCEIROS (medição por VALOR/PESO)
  valorPrevisto?: number; // Valor previsto em R$
  valorRealizado?: number; // Valor realizado em R$
  pesoFinanceiro?: number; // Peso no orçamento total (%)
}

export interface Material {
  id: string;
  name: string;
  unit: string;
  stock: number;
  minStock: number;
  consumedToday: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  estimated: number;
  spent: number;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'PDF' | 'DWG' | 'XLSX' | 'MPP' | 'IFC';
  category: 'Arquitetura' | 'Estrutural' | 'Instalações' | 'Cronograma' | 'Legal' | 'BIM';
  date: string;
  size: string;
}

export interface DailyLogData {
  weather: 'sunny' | 'cloudy' | 'rainy' | 'storm';
  teamSize: number;
  hoursWorked: number;
  production: {
    concrete: number; // m3
    steel: number; // kg
    formwork: number; // m2
  };
  occurrences: string[];
  photos: string[]; // base64 or url
  summary: string;
}

export interface IfcElement {
  id: string;
  type: string;
  name: string;
  level: string;
  properties: {
    volume: number;
    area: number;
    material: string;
  }
}

export type ReportType = 'general' | 'blocks' | 'tasks' | 'financial';
export type ReportPeriod = 'last-month' | 'last-3-months' | 'last-6-months' | 'last-year' | 'all-time';
export type ExportFormat = 'pdf' | 'word';

export interface ReportConfig {
  type: ReportType;
  period: ReportPeriod;
  includeCharts: boolean;
  includePhotos: boolean;
  exportFormat?: ExportFormat;
}
