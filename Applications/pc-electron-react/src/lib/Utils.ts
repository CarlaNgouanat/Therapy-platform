import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fonction nécessaire pour shadcn/ui (merge des classes tailwindcss)
 * @param inputs Liste des classes
 * @returns Renvoie un string avec tous les paramètres
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
