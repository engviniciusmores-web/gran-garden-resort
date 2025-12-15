/**
 * Utility functions for date handling in Portuguese
 */

/**
 * Format a date string to Brazilian Portuguese format (DD/MM/YYYY)
 */
export const formatDateBR = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Check if a task is overdue
 */
export const isTaskOverdue = (deadline: string, status: string): boolean => {
  if (status === 'Concluído') return false;
  
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  
  return deadlineDate < today;
};

/**
 * Calculate days until deadline
 */
export const daysUntilDeadline = (deadline: string): number => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Get status color for tasks
 */
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'A Fazer': 'bg-blue-100 text-blue-800',
    'Em Andamento': 'bg-yellow-100 text-yellow-800',
    'Em Andamento - Inicial': 'bg-yellow-100 text-yellow-800',
    'Em Andamento - Avançado': 'bg-orange-100 text-orange-800',
    'Concluído': 'bg-green-100 text-green-800',
    'Atrasado': 'bg-red-100 text-red-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};
