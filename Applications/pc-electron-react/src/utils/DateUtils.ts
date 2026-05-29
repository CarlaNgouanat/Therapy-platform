import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date en format court : 25/03/2026
 */
export function formatDateShort(date: Date): string {
  return format(date, 'dd/MM/yyyy', { locale: fr });
}

/**
 * Formate une date en format long localisé : 25 mars 2026
 */
export function formatDateLong(date: Date): string {
  return format(date, 'PPP', { locale: fr });
}

/**
 * Formate une heure : 14:30
 */
export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}
