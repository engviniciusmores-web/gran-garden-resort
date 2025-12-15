import { Project, Task, Material, BudgetCategory, ProjectFile } from './types';

const TEAM_1 = "Caio, Daniel, Pedro";
const TEAM_2 = "Lucas, Junior, Artur";
const TEAM_3 = "Tatiane, Luis";

// Imagem oficial do Gran Garden Resort
const RESORT_RENDER_IMG = "https://raw.githubusercontent.com/user-attachments/assets/gran-garden-resort.jpg";

export const MOCK_PROJECTS: Project[] = [
  // Equipe 1
  { 
    id: 'A1', 
    name: 'Bloco A1', 
    location: 'Gran Garden Resort', 
    status: 'Em Andamento', 
    progress: 45, 
    area: 2265.8, 
    concreteVolume: 405.8, 
    teamName: 'Equipe 1', 
    teamMembers: TEAM_1,
    budgetTotal: 192862137.74,
    imageUrl: RESORT_RENDER_IMG
  },
  { id: 'A2', name: 'Bloco A2', location: 'Gran Garden Resort', status: 'Em Andamento', progress: 30, area: 2180.7, concreteVolume: 396.2, teamName: 'Equipe 1', teamMembers: TEAM_1 },
  { id: 'A3', name: 'Bloco A3', location: 'Gran Garden Resort', status: 'A Iniciar', progress: 0, area: 2265.8, concreteVolume: 407.6, teamName: 'Equipe 1', teamMembers: TEAM_1 },
  { id: 'A4', name: 'Bloco A4', location: 'Gran Garden Resort', status: 'A Iniciar', progress: 0, area: 2262.2, concreteVolume: 402.0, teamName: 'Equipe 1', teamMembers: TEAM_1 },
  { id: 'REC', name: 'Recepção', location: 'Gran Garden Resort', status: 'Finalizada', progress: 100, area: 7494.6, concreteVolume: 1672.4, teamName: 'Equipe 1', teamMembers: TEAM_1 },

  // Equipe 3 (Blocos B e Serviços Lazer parte)
  { id: 'B1', name: 'Bloco B1', location: 'Gran Garden Resort', status: 'Em Andamento', progress: 60, area: 2265.8, concreteVolume: 401.2, teamName: 'Equipe 3', teamMembers: TEAM_3 },
  { id: 'B2', name: 'Bloco B2', location: 'Gran Garden Resort', status: 'Em Andamento', progress: 55, area: 2307.7, concreteVolume: 411.5, teamName: 'Equipe 3', teamMembers: TEAM_3 },
  { id: 'B3', name: 'Bloco B3', location: 'Gran Garden Resort', status: 'Atrasada', progress: 15, area: 2311.9, concreteVolume: 394.7, teamName: 'Equipe 3', teamMembers: TEAM_3 },
  { id: 'B4', name: 'Bloco B4', location: 'Gran Garden Resort', status: 'A Iniciar', progress: 0, area: 2302.4, concreteVolume: 442.6, teamName: 'Equipe 3', teamMembers: TEAM_3 },

  // Equipe 2
  { id: 'C1', name: 'Bloco C1', location: 'Gran Garden Resort', status: 'Em Andamento', progress: 80, area: 2188.7, concreteVolume: 394.1, teamName: 'Equipe 2', teamMembers: TEAM_2 },
  { id: 'C2', name: 'Bloco C2', location: 'Gran Garden Resort', status: 'Em Andamento', progress: 75, area: 2284.2, concreteVolume: 427.9, teamName: 'Equipe 2', teamMembers: TEAM_2 },
  { id: 'C3', name: 'Bloco C3', location: 'Gran Garden Resort', status: 'Atrasada', progress: 40, area: 2180.7, concreteVolume: 387.6, teamName: 'Equipe 2', teamMembers: TEAM_2 },
  { id: 'C4', name: 'Bloco C4', location: 'Gran Garden Resort', status: 'Em Andamento', progress: 20, area: 2265.8, concreteVolume: 405.3, teamName: 'Equipe 2', teamMembers: TEAM_2 },
  { id: 'BAR', name: 'Bar do Lago', location: 'Gran Garden Resort', status: 'Finalizada', progress: 100, area: 586.1, concreteVolume: 123.2, teamName: 'Equipe 2', teamMembers: TEAM_2 },

  // Misto
  { id: 'SERV', name: 'Serviços e Lazer', location: 'Gran Garden Resort', status: 'Em Andamento', progress: 50, area: 6636.0, concreteVolume: 1440.2, teamName: 'Equipe 2/3', teamMembers: `${TEAM_2} / ${TEAM_3}` },
];

// ================================================================================================
// DADOS COMPLETOS DO CRONOGRAMA GAV - Gran Garden Resort
// ================================================================================================
// Integração completa do sistema UNICIFA
// Data: 13/12/2025
// Total de tarefas: 4.221 | Orçamento: R$ 192.862.158,23 | 57 Materiais | 33 Arquivos
// MEDIÇÃO POR PESO/VALOR FINANCEIRO (não por quantidade de tarefas)
// ================================================================================================

// Importar dados completos integrados
import dadosIntegrados from './dados_integrados.json';

// Extrair tarefas com valores financeiros
const TODAS_AS_TAREFAS_COM_VALORES = dadosIntegrados.tarefas_completas;

// Função para atribuir responsável baseado no bloco
const atribuirResponsavel = (bloco: string, index: number): string => {
  if (!bloco || bloco === '-') {
    // Distribuir ciclicamente entre as equipes
    const equipes = ['Caio Silva', 'Daniel Costa', 'Pedro Oliveira', 'Lucas Santos', 'Junior Alves', 'Artur Lima'];
    return equipes[index % equipes.length];
  }
  
  // Atribuir por bloco
  if (bloco.includes('BLOCO A')) return 'Caio Silva';
  if (bloco.includes('BLOCO B')) return 'Daniel Costa';
  if (bloco.includes('BLOCO C')) return 'Pedro Oliveira';
  if (bloco.includes('Lazer')) return 'Lucas Santos';
  if (bloco.includes('Recepção')) return 'Junior Alves';
  
  // Distribuir demais
  const equipes = ['Caio Silva', 'Daniel Costa', 'Pedro Oliveira', 'Lucas Santos', 'Junior Alves', 'Artur Lima'];
  return equipes[index % equipes.length];
};

// Converter para formato Task[] (compatibilidade com app)
const TODAS_AS_TAREFAS: Task[] = TODAS_AS_TAREFAS_COM_VALORES.map((t: any, index: number) => ({
  id: String(t.id),
  name: t.name,
  deadline: t.end_baseline || t.end_real || '2025-12-31',
  status: t.status || 'A Fazer',
  responsible: t.responsavel && t.responsavel !== '-' ? t.responsavel : atribuirResponsavel(t.bloco, index),
  plannedStart: t.start_baseline,
  plannedEnd: t.end_baseline,
  actualStart: t.start_real || t.inicio_real,
  actualEnd: t.end_real || t.termino_real,
  progress: t.realizado_pct || 0,
  // NOVOS CAMPOS FINANCEIROS
  valorPrevisto: t.valor_previsto,
  valorRealizado: t.valor_realizado,
  pesoFinanceiro: t.peso_financeiro  // % do orçamento total
}));

// Exportar tarefas para visualização (primeiras 200 mais importantes por valor)
const tarefasOrdenadas = [...TODAS_AS_TAREFAS].sort((a, b) => (b.valorPrevisto || 0) - (a.valorPrevisto || 0));
export const MOCK_TASKS: Task[] = tarefasOrdenadas.slice(0, 200);

// Exportar TODAS as tarefas
export const ALL_TASKS: Task[] = TODAS_AS_TAREFAS;

// Dados do projeto
export const PROJETO_INFO = dadosIntegrados.projeto;

// Estatísticas financeiras
export const ESTATISTICAS_FINANCEIRAS = dadosIntegrados.estatisticas;

// Tarefas originais (mantidas para referência)
export const MOCK_TASKS_ORIGINAL: Task[] = [
  {
    id: '1',
    name: 'Limpeza de Terreno BLOCO A1 - A1 - Térreo',
    deadline: '2025-05-28',
    status: 'Concluído',
    responsible: 'Equipe Caio',
    plannedStart: '2025-05-19',
    plannedEnd: '2025-05-28',
    actualStart: '2025-05-19',
    actualEnd: '2025-05-28',
    progress: 100
  },
  {
    id: '2',
    name: 'Limpeza de Terreno Lazer - Laz - 2oSS',
    deadline: '2025-06-10',
    status: 'Concluído',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-05-28',
    plannedEnd: '2025-06-10',
    actualStart: '2025-05-28',
    actualEnd: '2025-06-10',
    progress: 100
  },
  {
    id: '3',
    name: 'Limpeza de Terreno Lazer - Laz - 01P',
    deadline: '2025-06-10',
    status: 'Concluído',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-05-28',
    plannedEnd: '2025-06-10',
    actualStart: '2025-05-28',
    actualEnd: '2025-06-10',
    progress: 100
  },
  {
    id: '4',
    name: 'Escavações e Aterros BLOCO A1 - A1 - Térreo',
    deadline: '2025-06-09',
    status: 'Concluído',
    responsible: 'Equipe Caio',
    plannedStart: '2025-05-29',
    plannedEnd: '2025-06-09',
    actualStart: '2025-05-29',
    actualEnd: '2025-06-09',
    progress: 100
  },
  {
    id: '5',
    name: 'Limpeza de Terreno BLOCO C4 - C4 - Térreo',
    deadline: '2025-06-09',
    status: 'Concluído',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-05-29',
    plannedEnd: '2025-06-09',
    actualStart: '2025-05-29',
    actualEnd: '2025-06-09',
    progress: 100
  },
  {
    id: '6',
    name: 'Fundação BLOCO A1 - A1 - Térreo',
    deadline: '2025-07-01',
    status: 'Concluído',
    responsible: 'Equipe Caio',
    plannedStart: '2025-06-10',
    plannedEnd: '2025-07-01',
    actualStart: '2025-06-10',
    actualEnd: '2025-07-01',
    progress: 100
  },
  {
    id: '7',
    name: 'Escavações e Aterros BLOCO C4 - C4 - Térreo',
    deadline: '2025-06-20',
    status: 'Concluído',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-06-10',
    plannedEnd: '2025-06-20',
    actualStart: '2025-06-10',
    actualEnd: '2025-06-20',
    progress: 100
  },
  {
    id: '8',
    name: 'Limpeza de Terreno BLOCO C3 - C3 - Térreo',
    deadline: '2025-06-20',
    status: 'Concluído',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-06-10',
    plannedEnd: '2025-06-20',
    actualStart: '2025-06-10',
    actualEnd: '2025-06-20',
    progress: 100
  },
  {
    id: '9',
    name: 'Limpeza de Terreno Lazer - Laz - 02P',
    deadline: '2025-06-17',
    status: 'Concluído',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-06-11',
    plannedEnd: '2025-06-17',
    actualStart: '2025-06-11',
    actualEnd: '2025-06-17',
    progress: 100
  },
  {
    id: '10',
    name: 'Fundação BLOCO C4 - C4 - Térreo',
    deadline: '2025-07-11',
    status: 'Concluído',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-06-23',
    plannedEnd: '2025-07-11',
    actualStart: '2025-06-23',
    actualEnd: '2025-07-11',
    progress: 100
  },
  {
    id: '11',
    name: 'Escavações e Aterros BLOCO C3 - C3 - Térreo',
    deadline: '2025-07-02',
    status: 'Concluído',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-06-23',
    plannedEnd: '2025-07-02',
    actualStart: '2025-06-23',
    actualEnd: '2025-07-02',
    progress: 100
  },
  {
    id: '12',
    name: 'Limpeza de Terreno BLOCO A2 - A2 - Térreo',
    deadline: '2025-07-02',
    status: 'Concluído',
    responsible: 'Equipe Caio',
    plannedStart: '2025-06-23',
    plannedEnd: '2025-07-02',
    actualStart: '2025-06-23',
    actualEnd: '2025-07-02',
    progress: 100
  },
  {
    id: '13',
    name: 'Fundação BLOCO C3 - C3 - Térreo',
    deadline: '2025-07-23',
    status: 'Concluído',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-07-03',
    plannedEnd: '2025-07-23',
    actualStart: '2025-07-03',
    actualEnd: '2025-07-23',
    progress: 100
  },
  {
    id: '14',
    name: 'Escavações e Aterros BLOCO A2 - A2 - Térreo',
    deadline: '2025-07-14',
    status: 'Concluído',
    responsible: 'Equipe Caio',
    plannedStart: '2025-07-03',
    plannedEnd: '2025-07-14',
    actualStart: '2025-07-03',
    actualEnd: '2025-07-14',
    progress: 100
  },
  {
    id: '15',
    name: 'Limpeza de Terreno BLOCO C2 - C2 - Térreo',
    deadline: '2025-07-14',
    status: 'Concluído',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-07-03',
    plannedEnd: '2025-07-14',
    actualStart: '2025-07-03',
    actualEnd: '2025-07-14',
    progress: 100
  },
  {
    id: '16',
    name: 'Escavações e Aterros Lazer - Laz - 02P',
    deadline: '2025-07-14',
    status: 'Concluído',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-07-03',
    plannedEnd: '2025-07-14',
    actualStart: '2025-07-03',
    actualEnd: '2025-07-14',
    progress: 100
  },
  {
    id: '17',
    name: 'Limpeza de Terreno BLOCO A3 - A3 - Térreo',
    deadline: '2025-07-24',
    status: 'Concluído',
    responsible: 'Equipe Caio',
    plannedStart: '2025-07-15',
    plannedEnd: '2025-07-24',
    actualStart: '2025-07-15',
    actualEnd: '2025-07-24',
    progress: 100
  },
  {
    id: '18',
    name: 'Escavações e Aterros BLOCO C2 - C2 - Térreo',
    deadline: '2025-07-24',
    status: 'Concluído',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-07-15',
    plannedEnd: '2025-07-24',
    actualStart: '2025-07-15',
    actualEnd: '2025-07-24',
    progress: 100
  },
  {
    id: '19',
    name: 'Escavações e Aterros BLOCO A3 - A3 - Térreo',
    deadline: '2025-08-05',
    status: 'Concluído',
    responsible: 'Equipe Caio',
    plannedStart: '2025-07-25',
    plannedEnd: '2025-08-05',
    actualStart: '2025-07-25',
    actualEnd: '2025-08-05',
    progress: 100
  },
  {
    id: '20',
    name: 'Fundação BLOCO C2 - C2 - Térreo',
    deadline: '2025-08-14',
    status: 'Concluído',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-07-25',
    plannedEnd: '2025-08-14',
    actualStart: '2025-07-25',
    actualEnd: '2025-08-14',
    progress: 100
  },
  {
    id: '21',
    name: 'Limpeza de Terreno BLOCO C1 - C1 - Térreo',
    deadline: '2025-08-05',
    status: 'Concluído',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-07-25',
    plannedEnd: '2025-08-05',
    actualStart: '2025-07-25',
    actualEnd: '2025-08-05',
    progress: 100
  },
  {
    id: '22',
    name: 'Estrutura BLOCO A1 - A1 - Térreo',
    deadline: '2025-08-15',
    status: 'Concluído',
    responsible: 'Equipe Caio',
    plannedStart: '2025-07-31',
    plannedEnd: '2025-08-15',
    actualStart: '2025-07-31',
    actualEnd: '2025-08-20',
    progress: 100
  },
  {
    id: '23',
    name: 'Contenções BLOCO A1 - A1 - Térreo',
    deadline: '2025-08-08',
    status: 'Concluído',
    responsible: 'Equipe Caio',
    plannedStart: '2025-07-31',
    plannedEnd: '2025-08-08',
    actualStart: '2025-07-31',
    actualEnd: '2025-08-08',
    progress: 100
  },
  {
    id: '24',
    name: 'Contenções BLOCO C4 - C4 - Térreo',
    deadline: '2025-08-08',
    status: 'Concluído',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-07-31',
    plannedEnd: '2025-08-08',
    actualStart: '2025-07-31',
    actualEnd: '2025-08-08',
    progress: 100
  },
  {
    id: '25',
    name: 'Limpeza de Terreno BLOCO A4 - A4 - Térreo',
    deadline: '2025-08-15',
    status: 'Concluído',
    responsible: 'Equipe Caio',
    plannedStart: '2025-08-06',
    plannedEnd: '2025-08-15',
    actualStart: '2025-08-06',
    actualEnd: '2025-08-15',
    progress: 100
  },
  {
    id: '26',
    name: 'Fundação BLOCO A3 - A3 - Térreo',
    deadline: '2025-08-26',
    status: 'Concluído',
    responsible: 'Equipe Caio',
    plannedStart: '2025-08-06',
    plannedEnd: '2025-08-26',
    actualStart: '2025-08-06',
    actualEnd: '2025-08-26',
    progress: 100
  },
  {
    id: '27',
    name: 'Escavações e Aterros BLOCO C1 - C1 - Térreo',
    deadline: '2025-08-15',
    status: 'Concluído',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-08-06',
    plannedEnd: '2025-08-15',
    actualStart: '2025-08-06',
    actualEnd: '2025-08-15',
    progress: 100
  },
  {
    id: '28',
    name: 'Escavações e Aterros BLOCO A4 - A4 - Térreo',
    deadline: '2025-08-27',
    status: 'Concluído',
    responsible: 'Equipe Caio',
    plannedStart: '2025-08-18',
    plannedEnd: '2025-08-27',
    actualStart: '2025-08-18',
    actualEnd: '2025-08-27',
    progress: 100
  },
  {
    id: '29',
    name: 'Limpeza de Terreno BLOCO B4 - B4 - Térreo',
    deadline: '2025-08-27',
    status: 'Concluído',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-08-18',
    plannedEnd: '2025-08-27',
    actualStart: '2025-08-18',
    actualEnd: '2025-08-27',
    progress: 100
  },
  {
    id: '30',
    name: 'Fundação BLOCO A4 - A4 - Térreo',
    deadline: '2025-09-17',
    status: 'Concluído',
    responsible: 'Equipe Caio',
    plannedStart: '2025-08-28',
    plannedEnd: '2025-09-17',
    actualStart: '2025-08-28',
    actualEnd: '2025-09-17',
    progress: 100
  },
  {
    id: '31',
    name: 'Escavações e Aterros Lazer - Laz - 01P',
    deadline: '2025-07-02',
    status: 'Em Andamento',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-06-11',
    plannedEnd: '2025-07-02',
    actualStart: '2025-06-11',
    actualEnd: '2025-07-02',
    progress: 90
  },
  {
    id: '32',
    name: 'Fundação BLOCO A2 - A2 - Térreo',
    deadline: '2025-08-04',
    status: 'Em Andamento',
    responsible: 'Equipe Caio',
    plannedStart: '2025-07-15',
    plannedEnd: '2025-08-04',
    actualStart: '2025-07-15',
    actualEnd: '2025-08-04',
    progress: 95
  },
  {
    id: '33',
    name: 'Escavações e Aterros Lazer - Laz - 2oSS',
    deadline: '2025-09-11',
    status: 'Em Andamento',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-08-22',
    plannedEnd: '2025-09-11',
    actualStart: '2025-08-22',
    actualEnd: '2025-10-31',
    progress: 80
  },
  {
    id: '34',
    name: 'Contenções Lazer - Laz - 2oSS',
    deadline: '2025-09-11',
    status: 'Em Andamento',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-08-22',
    plannedEnd: '2025-09-11',
    actualStart: '2025-08-22',
    actualEnd: '2025-11-14',
    progress: 80
  },
  {
    id: '35',
    name: 'Contenções Lazer - Laz - 1oSS',
    deadline: '2025-09-18',
    status: 'Em Andamento',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-09-12',
    plannedEnd: '2025-09-18',
    actualStart: '2025-08-22',
    actualEnd: '2025-11-14',
    progress: 90
  },
  {
    id: '36',
    name: 'Escavações e Aterros BLOCO B4 - B4 - Térreo',
    deadline: '2025-09-08',
    status: 'Em Andamento',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-08-28',
    plannedEnd: '2025-09-08',
    actualStart: '2025-10-13',
    actualEnd: '2025-10-22',
    progress: 95
  },
  {
    id: '37',
    name: 'Contenções BLOCO B4 - B4 - Térreo',
    deadline: '2026-03-03',
    status: 'Em Andamento',
    responsible: 'Equipe Lucas',
    plannedStart: '2026-02-23',
    plannedEnd: '2026-03-03',
    actualStart: '2025-10-13',
    actualEnd: '2026-01-19',
    progress: 85
  },
  {
    id: '38',
    name: 'Contenções BLOCO B3 - B3 - Térreo',
    deadline: '2026-05-13',
    status: 'Em Andamento',
    responsible: 'Equipe Lucas',
    plannedStart: '2026-05-05',
    plannedEnd: '2026-05-13',
    actualStart: '2025-10-13',
    actualEnd: '2026-01-19',
    progress: 90
  },
  {
    id: '39',
    name: 'Fundação Recepção - Rec - 2SS',
    deadline: '2025-09-15',
    status: 'Em Andamento',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-08-26',
    plannedEnd: '2025-09-15',
    actualStart: '2025-10-13',
    actualEnd: '2025-12-18',
    progress: 75
  },
  {
    id: '40',
    name: 'Estrutura BLOCO A4 - A4 - 02P',
    deadline: '2026-04-14',
    status: 'Em Andamento',
    responsible: 'Equipe Caio',
    plannedStart: '2026-03-27',
    plannedEnd: '2026-04-14',
    actualStart: '2025-10-20',
    actualEnd: '2025-11-07',
    progress: 30
  },
  {
    id: '41',
    name: 'Escavações e Aterros BLOCO B3 - B3 - Térreo',
    deadline: '2025-09-18',
    status: 'Em Andamento',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-09-09',
    plannedEnd: '2025-09-18',
    actualStart: '2025-10-23',
    actualEnd: '2025-11-03',
    progress: 95
  },
  {
    id: '42',
    name: 'Estrutura BLOCO C4 - C4 - 02P',
    deadline: '2025-09-18',
    status: 'Em Andamento',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-09-03',
    plannedEnd: '2025-09-18',
    actualStart: '2025-11-03',
    actualEnd: '2025-11-24',
    progress: 50
  },
  {
    id: '43',
    name: 'Escavações e Aterros BLOCO B2 - B2 - Térreo',
    deadline: '2025-09-30',
    status: 'Em Andamento',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-09-19',
    plannedEnd: '2025-09-30',
    actualStart: '2025-11-04',
    actualEnd: '2025-11-13',
    progress: 95
  },
  {
    id: '44',
    name: 'Escavações e Aterros BLOCO B1 - B1 - Térreo',
    deadline: '2025-10-10',
    status: 'Em Andamento',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-10-01',
    plannedEnd: '2025-10-10',
    actualStart: '2025-11-14',
    actualEnd: '2025-11-26',
    progress: 70
  },
  {
    id: '45',
    name: 'Contenções Lazer - Laz - 01P',
    deadline: '2026-03-19',
    status: 'Em Andamento',
    responsible: 'Equipe Tatiane',
    plannedStart: '2026-02-27',
    plannedEnd: '2026-03-19',
    actualStart: '2025-11-17',
    actualEnd: '2026-01-05',
    progress: 85
  },
  {
    id: '46',
    name: 'Estrutura BLOCO A3 - A3 - Térreo',
    deadline: '2025-12-31',
    status: 'Em Andamento',
    responsible: 'Equipe Caio',
    plannedStart: '2025-12-15',
    plannedEnd: '2025-12-31',
    actualStart: '2025-12-02',
    actualEnd: '2026-01-05',
    progress: 20
  },
  {
    id: '47',
    name: 'Contenções BLOCO C1 - C1 - Térreo',
    deadline: '2026-03-03',
    status: 'Em Andamento',
    responsible: 'Equipe Lucas',
    plannedStart: '2026-02-23',
    plannedEnd: '2026-03-03',
    actualStart: '2025-12-08',
    actualEnd: '2026-01-09',
    progress: 95
  },
  {
    id: '48',
    name: 'Limpeza Inicial e Tratamento de Estrutura BLOCO A1 - A1 - Térreo',
    deadline: '2025-11-07',
    status: 'Em Andamento',
    responsible: 'Equipe Caio',
    plannedStart: '2025-11-03',
    plannedEnd: '2025-11-07',
    actualStart: '2025-12-15',
    actualEnd: '2025-12-19',
    progress: 40
  },
  {
    id: '49',
    name: 'Estrutura BLOCO C2 - C2 - Térreo',
    deadline: '2025-12-31',
    status: 'Em Andamento',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-12-15',
    plannedEnd: '2025-12-31',
    actualStart: '2025-12-16',
    actualEnd: '2026-01-19',
    progress: 5
  },
  {
    id: '50',
    name: 'Contenções BLOCO C2 - C2 - Térreo',
    deadline: '2025-12-23',
    status: 'Em Andamento',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-12-15',
    plannedEnd: '2025-12-23',
    actualStart: '2025-12-16',
    actualEnd: '2026-01-19',
    progress: 75
  },
  {
    id: '51',
    name: 'Fundação BLOCO C1 - C1 - Térreo',
    deadline: '2025-09-05',
    status: 'Atrasado',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-08-18',
    plannedEnd: '2025-09-05',
    actualStart: '2025-08-18',
    actualEnd: '2025-09-05',
    progress: 0
  },
  {
    id: '52',
    name: 'Estrutura BLOCO A4 - A4 - Cobertura',
    deadline: '2026-05-04',
    status: 'Atrasado',
    responsible: 'Equipe Caio',
    plannedStart: '2026-04-15',
    plannedEnd: '2026-05-04',
    actualStart: '2025-11-10',
    actualEnd: '2025-12-01',
    progress: 0
  },
  {
    id: '53',
    name: 'Estrutura Recepção - Rec - 2SS',
    deadline: '2025-10-06',
    status: 'Atrasado',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-09-16',
    plannedEnd: '2025-10-06',
    actualStart: '2025-11-11',
    actualEnd: '2025-12-19',
    progress: 0
  },
  {
    id: '54',
    name: 'Estrutura BLOCO C3 - C3 - Cobertura',
    deadline: '2025-12-12',
    status: 'Atrasado',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-11-27',
    plannedEnd: '2025-12-12',
    actualStart: '2025-11-14',
    actualEnd: '2025-12-05',
    progress: 0
  },
  {
    id: '55',
    name: 'Estrutura BLOCO A2 - A2 - Térreo',
    deadline: '2025-10-22',
    status: 'Atrasado',
    responsible: 'Equipe Caio',
    plannedStart: '2025-10-07',
    plannedEnd: '2025-10-22',
    actualStart: '2025-11-17',
    actualEnd: '2025-12-08',
    progress: 0
  },
  {
    id: '56',
    name: 'Contenções BLOCO A2 - A2 - Térreo',
    deadline: '2025-10-15',
    status: 'Atrasado',
    responsible: 'Equipe Caio',
    plannedStart: '2025-10-07',
    plannedEnd: '2025-10-15',
    actualStart: '2025-11-17',
    actualEnd: '2025-12-08',
    progress: 0
  },
  {
    id: '57',
    name: 'Fundação Lazer - Laz - 2oSS',
    deadline: '2025-11-05',
    status: 'Atrasado',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-10-09',
    plannedEnd: '2025-11-05',
    actualStart: '2025-11-17',
    actualEnd: '2026-02-02',
    progress: 0
  },
  {
    id: '58',
    name: 'Blocos de Coroamento Lazer - Laz - 2oSS',
    deadline: '2025-11-19',
    status: 'Atrasado',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-11-06',
    plannedEnd: '2025-11-19',
    actualStart: '2025-11-17',
    actualEnd: '2026-02-02',
    progress: 0
  },
  {
    id: '59',
    name: 'Estrutura BLOCO C4 - C4 - Cobertura',
    deadline: '2025-10-06',
    status: 'Atrasado',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-09-19',
    plannedEnd: '2025-10-06',
    actualStart: '2025-11-25',
    actualEnd: '2025-12-15',
    progress: 0
  },
  {
    id: '60',
    name: 'Contenções BLOCO A3 - A3 - Térreo',
    deadline: '2025-12-23',
    status: 'Atrasado',
    responsible: 'Equipe Caio',
    plannedStart: '2025-12-15',
    plannedEnd: '2025-12-23',
    actualStart: '2025-12-02',
    actualEnd: '2026-01-05',
    progress: 0
  },
  {
    id: '61',
    name: 'Fundação BLOCO B4 - B4 - Térreo',
    deadline: '2025-09-29',
    status: 'A Fazer',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-09-09',
    plannedEnd: '2025-09-29',
    actualStart: '2026-01-12',
    actualEnd: '2026-01-30',
    progress: 0
  },
  {
    id: '62',
    name: 'Fundação BLOCO B3 - B3 - Térreo',
    deadline: '2025-10-09',
    status: 'A Fazer',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-09-19',
    plannedEnd: '2025-10-09',
    actualStart: '2026-02-16',
    actualEnd: '2026-03-06',
    progress: 0
  },
  {
    id: '63',
    name: 'Fundação BLOCO B2 - B2 - Térreo',
    deadline: '2025-10-21',
    status: 'A Fazer',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-10-01',
    plannedEnd: '2025-10-21',
    actualStart: '2026-03-02',
    actualEnd: '2026-03-20',
    progress: 0
  },
  {
    id: '64',
    name: 'Estrutura Recepção - Rec - 1SS',
    deadline: '2025-11-17',
    status: 'A Fazer',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-10-07',
    plannedEnd: '2025-11-17',
    actualStart: '2026-01-05',
    actualEnd: '2026-02-13',
    progress: 0
  },
  {
    id: '65',
    name: 'Fundação BLOCO B1 - B1 - Térreo',
    deadline: '2025-10-31',
    status: 'A Fazer',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-10-13',
    plannedEnd: '2025-10-31',
    actualStart: '2026-02-23',
    actualEnd: '2026-03-13',
    progress: 0
  },
  {
    id: '66',
    name: 'Estrutura BLOCO A2 - A2 - 01P',
    deadline: '2025-11-07',
    status: 'A Fazer',
    responsible: 'Equipe Caio',
    plannedStart: '2025-10-23',
    plannedEnd: '2025-11-07',
    actualStart: '2025-12-09',
    actualEnd: '2026-01-12',
    progress: 0
  },
  {
    id: '67',
    name: 'Contenções BLOCO A2 - A2 - 01P',
    deadline: '2025-10-31',
    status: 'A Fazer',
    responsible: 'Equipe Caio',
    plannedStart: '2025-10-23',
    plannedEnd: '2025-10-31',
    actualStart: '2025-12-09',
    actualEnd: '2026-01-12',
    progress: 0
  },
  {
    id: '68',
    name: 'Limpeza Inicial e Tratamento de Estrutura BLOCO C4 - C4 - Térreo',
    deadline: '2025-11-07',
    status: 'A Fazer',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-11-03',
    plannedEnd: '2025-11-07',
    actualStart: '2026-01-26',
    actualEnd: '2026-01-30',
    progress: 0
  },
  {
    id: '69',
    name: 'Fundação Lazer - Laz - 1oSS',
    deadline: '2025-12-04',
    status: 'A Fazer',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-11-06',
    plannedEnd: '2025-12-04',
    actualStart: '2026-01-05',
    actualEnd: '2026-02-13',
    progress: 0
  },
  {
    id: '70',
    name: 'Gás Enterrado BLOCO A1 - A1 - Térreo',
    deadline: '2025-11-17',
    status: 'A Fazer',
    responsible: 'Equipe Caio',
    plannedStart: '2025-11-10',
    plannedEnd: '2025-11-17',
    actualStart: '2026-01-05',
    actualEnd: '2026-01-12',
    progress: 0
  },
  {
    id: '71',
    name: 'Hidrossanitário Enterrado BLOCO A1 - A1 - Térreo',
    deadline: '2025-11-17',
    status: 'A Fazer',
    responsible: 'Equipe Caio',
    plannedStart: '2025-11-10',
    plannedEnd: '2025-11-17',
    actualStart: '2026-01-05',
    actualEnd: '2026-01-12',
    progress: 0
  },
  {
    id: '72',
    name: 'SPDA Enterrados BLOCO A1 - A1 - Térreo',
    deadline: '2025-11-17',
    status: 'A Fazer',
    responsible: 'Equipe Caio',
    plannedStart: '2025-11-10',
    plannedEnd: '2025-11-17',
    actualStart: '2026-01-05',
    actualEnd: '2026-01-12',
    progress: 0
  },
  {
    id: '73',
    name: 'Limpeza Inicial e Tratamento de Estrutura BLOCO A1 - A1 - 01P',
    deadline: '2025-11-14',
    status: 'A Fazer',
    responsible: 'Equipe Caio',
    plannedStart: '2025-11-10',
    plannedEnd: '2025-11-14',
    actualStart: '2026-01-05',
    actualEnd: '2026-01-09',
    progress: 0
  },
  {
    id: '74',
    name: 'Estrutura BLOCO A2 - A2 - 02P',
    deadline: '2025-11-26',
    status: 'A Fazer',
    responsible: 'Equipe Caio',
    plannedStart: '2025-11-10',
    plannedEnd: '2025-11-26',
    actualStart: '2026-01-13',
    actualEnd: '2026-02-02',
    progress: 0
  },
  {
    id: '75',
    name: 'Contenções BLOCO A2 - A2 - 02P',
    deadline: '2025-11-18',
    status: 'A Fazer',
    responsible: 'Equipe Caio',
    plannedStart: '2025-11-10',
    plannedEnd: '2025-11-18',
    actualStart: '2026-01-13',
    actualEnd: '2026-02-02',
    progress: 0
  },
  {
    id: '76',
    name: 'Gás Enterrado BLOCO C4 - C4 - Térreo',
    deadline: '2025-11-17',
    status: 'A Fazer',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-11-10',
    plannedEnd: '2025-11-17',
    actualStart: '2026-02-02',
    actualEnd: '2026-02-09',
    progress: 0
  },
  {
    id: '77',
    name: 'Hidrossanitário Enterrado BLOCO C4 - C4 - Térreo',
    deadline: '2025-11-17',
    status: 'A Fazer',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-11-10',
    plannedEnd: '2025-11-17',
    actualStart: '2026-02-02',
    actualEnd: '2026-02-09',
    progress: 0
  },
  {
    id: '78',
    name: 'SPDA Enterrados BLOCO C4 - C4 - Térreo',
    deadline: '2025-11-17',
    status: 'A Fazer',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-11-10',
    plannedEnd: '2025-11-17',
    actualStart: '2026-02-02',
    actualEnd: '2026-02-09',
    progress: 0
  },
  {
    id: '79',
    name: 'Limpeza Inicial e Tratamento de Estrutura BLOCO C4 - C4 - 01P',
    deadline: '2025-11-14',
    status: 'A Fazer',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-11-10',
    plannedEnd: '2025-11-14',
    actualStart: '2026-02-02',
    actualEnd: '2026-02-06',
    progress: 0
  },
  {
    id: '80',
    name: 'Limpeza Inicial e Tratamento de Estrutura BLOCO A1 - A1 - 02P',
    deadline: '2025-11-24',
    status: 'A Fazer',
    responsible: 'Equipe Caio',
    plannedStart: '2025-11-17',
    plannedEnd: '2025-11-24',
    actualStart: '2026-01-12',
    actualEnd: '2026-01-16',
    progress: 0
  },
  {
    id: '81',
    name: 'Limpeza Inicial e Tratamento de Estrutura BLOCO C4 - C4 - 02P',
    deadline: '2025-11-24',
    status: 'A Fazer',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-11-17',
    plannedEnd: '2025-11-24',
    actualStart: '2026-02-09',
    actualEnd: '2026-02-13',
    progress: 0
  },
  {
    id: '82',
    name: 'Concretagem de Piso BLOCO A1 - A1 - Térreo',
    deadline: '2025-11-26',
    status: 'A Fazer',
    responsible: 'Equipe Caio',
    plannedStart: '2025-11-18',
    plannedEnd: '2025-11-26',
    actualStart: '2026-01-13',
    actualEnd: '2026-01-20',
    progress: 0
  },
  {
    id: '83',
    name: 'Concretagem de Piso BLOCO C4 - C4 - Térreo',
    deadline: '2025-11-26',
    status: 'A Fazer',
    responsible: 'Equipe Lucas',
    plannedStart: '2025-11-18',
    plannedEnd: '2025-11-26',
    actualStart: '2026-02-10',
    actualEnd: '2026-02-17',
    progress: 0
  },
  {
    id: '84',
    name: 'Estrutura Recepção - Rec - Térreo',
    deadline: '2025-12-31',
    status: 'A Fazer',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-11-18',
    plannedEnd: '2025-12-31',
    actualStart: '2026-02-16',
    actualEnd: '2026-03-27',
    progress: 0
  },
  {
    id: '85',
    name: 'Estrutura Lazer - Laz - 2oSS',
    deadline: '2025-12-11',
    status: 'A Fazer',
    responsible: 'Equipe Tatiane',
    plannedStart: '2025-11-21',
    plannedEnd: '2025-12-11',
    actualStart: '2025-12-09',
    actualEnd: '2026-02-02',
    progress: 0
  },
];

export const MOCK_MATERIALS: Material[] = [
  { id: '1', name: 'Cimento CP-II', unit: 'Sacos', stock: 150, minStock: 50, consumedToday: 20 },
  { id: '2', name: 'Areia Média', unit: 'm³', stock: 12, minStock: 15, consumedToday: 3 }, // Alert logic
  { id: '3', name: 'Aço CA-50 10mm', unit: 'Barra', stock: 300, minStock: 100, consumedToday: 0 },
  { id: '4', name: 'Tijolo Cerâmico', unit: 'Milheiro', stock: 5, minStock: 2, consumedToday: 0.5 },
];

// Dados extraídos do OCR - Categorias macro
export const MOCK_BUDGET: BudgetCategory[] = [
  { id: '08', name: 'Superestrutura', estimated: 38986850.65, spent: 38900000.00 },
  { id: '21', name: 'Instalações Prediais', estimated: 23365289.53, spent: 12000000.00 },
  { id: '16', name: 'Pisos/Revest. Área Comum', estimated: 19628318.65, spent: 5000000.00 },
  { id: '18', name: 'Esquadrias/Ferragens', estimated: 16920466.11, spent: 8000000.00 },
  { id: '01', name: 'Despesas com Pessoal', estimated: 11955182.71, spent: 11900000.00 },
  { id: '09', name: 'Paredes e Vedações', estimated: 10007800.22, spent: 9500000.00 },
  { id: '15', name: 'Pisos/Revest. Apto', estimated: 9735431.08, spent: 3000000.00 },
  { id: '05', name: 'Locação Máquinas/Equip.', estimated: 9666065.93, spent: 8500000.00 },
  { id: '23', name: 'Serviços Complementares', estimated: 9338445.94, spent: 2000000.00 },
  { id: '24', name: 'Infra Externa', estimated: 8098953.82, spent: 6000000.00 },
  { id: '07', name: 'Fundação', estimated: 2716035.10, spent: 2716035.10 },
];

export const MOCK_FILES: ProjectFile[] = [
  { id: '1', name: 'ORC-PR_GRAN-GARDEN_R03.xls', type: 'XLSX', category: 'Legal', date: '2025-10-01', size: '1.2 MB' },
  { id: '2', name: 'ARQ_PL_Terreo_Rev05.pdf', type: 'PDF', category: 'Arquitetura', date: '2025-10-01', size: '4.2 MB' },
  { id: '3', name: 'EST_Formas_Laje03.pdf', type: 'PDF', category: 'Estrutural', date: '2025-09-20', size: '2.1 MB' },
  { id: '4', name: 'Cronograma_Master_v2.mpp', type: 'MPP', category: 'Cronograma', date: '2025-08-15', size: '1.5 MB' },
];

export const WEATHER_OPTIONS = [
  { id: 'sunny', label: 'Ensolarado', icon: '☀️' },
  { id: 'cloudy', label: 'Nublado', icon: '☁️' },
  { id: 'rainy', label: 'Chuvoso', icon: '🌧️' },
  { id: 'storm', label: 'Tempestade', icon: '⛈️' },
];

// Dados de evolução temporal do projeto - Gran Garden Resort (Todos os blocos)
// Início: Maio/2025 | Linha de Base Rev. Out/2025 | Atual: Dez/2025
export const MOCK_TIMELINE_DATA = [
  { month: 'Mai/25', planned: 5, actual: 5 },     // Limpeza de terreno - 100% concluído
  { month: 'Jun/25', planned: 12, actual: 12 },   // Escavações e fundações A1 - 100%
  { month: 'Jul/25', planned: 20, actual: 20 },   // Fundações A1, C4 e Recepção - 100%
  { month: 'Ago/25', planned: 28, actual: 26 },   // Estrutura A1 Térreo - pequeno atraso (86%)
  { month: 'Set/25', planned: 38, actual: 34 },   // Estrutura B3, alvenarias - desvio crescente
  { month: 'Out/25', planned: 48, actual: 42 },   // Estrutura C3, instalações - DESVIO 6%
  { month: 'Nov/25', planned: 58, actual: 48 },   // Instalações elétricas/hidráulicas - DESVIO 10%
  { month: 'Dez/25', planned: 65, actual: 55 },   // ATUAL: Estrutura 1º pav, revestimentos - ATRASO 10%
  { month: 'Jan/26', planned: 73, actual: 55 },   // Projeção: Estrutura 2º pav, alvenarias
  { month: 'Fev/26', planned: 82, actual: 55 },   // Projeção: Fachadas, esquadrias, paisagismo
  { month: 'Mar/26', planned: 91, actual: 55 },   // Projeção: Revestimentos, pintura, louças
  { month: 'Abr/26', planned: 100, actual: 55 },  // Projeção: Acabamentos finais e entrega
];