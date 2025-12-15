// Dados completos importados do sistema de cronograma
// Total: 4.221 tarefas do Gran Garden Resort
// Gerado automaticamente em 13/12/2025

import { Task } from '../types';
import tarefasData from '../../tarefas_completas.json';

export const TAREFAS_COMPLETAS: Task[] = tarefasData as Task[];

// Estatísticas dos dados
export const ESTATISTICAS_TAREFAS = {
  total: 4221,
  concluido: 65,
  emAndamento: 20,
  atrasado: 10,
  aFazer: 4126
};

// Função auxiliar para filtrar por bloco
export function getTarefasPorBloco(bloco: string): Task[] {
  return TAREFAS_COMPLETAS.filter(t =>
    (t as any).bloco && (t as any).bloco.includes(bloco)
  );
}

// Função auxiliar para filtrar por status
export function getTarefasPorStatus(status: string): Task[] {
  return TAREFAS_COMPLETAS.filter(t => t.status === status);
}

// Função auxiliar para obter tarefas recentes (últimas N tarefas)
export function getTarefasRecentes(limit: number = 20): Task[] {
  return TAREFAS_COMPLETAS.slice(0, limit);
}
