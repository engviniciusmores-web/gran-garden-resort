import { describe, it, expect, beforeEach, vi } from 'vitest';
import { formatDateBR, isTaskOverdue, daysUntilDeadline, getStatusColor } from './dateUtils';

describe('dateUtils', () => {
  describe('formatDateBR', () => {
    it('should format date to Brazilian format', () => {
      expect(formatDateBR('2025-12-25')).toBe('25/12/2025');
    });

    it('should return empty string for empty input', () => {
      expect(formatDateBR('')).toBe('');
    });

    it('should return empty string for invalid date', () => {
      expect(formatDateBR('invalid-date')).toBe('');
    });

    it('should pad single digits with zero', () => {
      expect(formatDateBR('2025-01-05')).toBe('05/01/2025');
    });
  });

  describe('isTaskOverdue', () => {
    beforeEach(() => {
      // Mock the current date to 2025-12-15
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-12-15'));
    });

    it('should return true for overdue task', () => {
      expect(isTaskOverdue('2025-12-10', 'A Fazer')).toBe(true);
    });

    it('should return false for future deadline', () => {
      expect(isTaskOverdue('2025-12-20', 'A Fazer')).toBe(false);
    });

    it('should return false for completed task even if overdue', () => {
      expect(isTaskOverdue('2025-12-10', 'Concluído')).toBe(false);
    });

    it('should return false for today deadline', () => {
      expect(isTaskOverdue('2025-12-15', 'Em Andamento')).toBe(false);
    });
  });

  describe('daysUntilDeadline', () => {
    beforeEach(() => {
      // Mock the current date to 2025-12-15
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-12-15'));
    });

    it('should calculate positive days for future deadline', () => {
      expect(daysUntilDeadline('2025-12-20')).toBe(5);
    });

    it('should calculate negative days for past deadline', () => {
      expect(daysUntilDeadline('2025-12-10')).toBe(-5);
    });

    it('should return 0 for today', () => {
      expect(daysUntilDeadline('2025-12-15')).toBe(0);
    });
  });

  describe('getStatusColor', () => {
    it('should return blue color for "A Fazer" status', () => {
      expect(getStatusColor('A Fazer')).toBe('bg-blue-100 text-blue-800');
    });

    it('should return yellow color for "Em Andamento" status', () => {
      expect(getStatusColor('Em Andamento')).toBe('bg-yellow-100 text-yellow-800');
    });

    it('should return green color for "Concluído" status', () => {
      expect(getStatusColor('Concluído')).toBe('bg-green-100 text-green-800');
    });

    it('should return red color for "Atrasado" status', () => {
      expect(getStatusColor('Atrasado')).toBe('bg-red-100 text-red-800');
    });

    it('should return default gray color for unknown status', () => {
      expect(getStatusColor('Unknown Status')).toBe('bg-gray-100 text-gray-800');
    });
  });
});
