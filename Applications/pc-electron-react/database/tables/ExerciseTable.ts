import { ExerciseType } from '@shared/types/ExerciseType';
import { AbstractTable } from '@database/tables/AbstractTable';

/**
 * Table représentant un exercice
 * Plus de détails sur les clés :
 * - model : correspond à la liste des types d'exercices disponibles (PCA, SFA, ...)
 * - patiend_id : un exercice n'est pas nécessaire lié à un patient d'où le "| null"
 * - data : correspond aux données stringifiées sur la configuration de l'exercice
 */
export interface ExerciseTable extends AbstractTable {
  id: number;
  name: string;
  model: ExerciseType;
  patient_id: number | null;
  created_at: string;
  data: string;
}
