import { ExerciseType } from '@shared/types/ExerciseType';
import { AbstractModel } from '@shared/models/AbstractModel';
import { PCAExerciseModel } from '@shared/models/exercises/PCAExerciseModel';
import { SFAExerciseModel } from '@shared/models/exercises/SFAExerciseModel';
import { OtherExerciseModel } from '@shared/models/exercises/OtherExerciseModel';

/**
 * Modèle représentant un exercice
 * Plus de détails sur les clés :
 * - model : correspond à la liste des types d'exercices disponibles (PCA, SFA, ...)
 * - patiendId : un exercice n'est pas nécessaire lié à un patient d'où le "| null"
 * - data : correspond aux données stringifiées sur la configuration de l'exercice
 */
export interface ExerciseModel extends AbstractModel {
  id: number;
  name: string;
  model: ExerciseType;
  patientId: number | null;
  createdAt: Date;
  data: PCAExerciseModel | SFAExerciseModel | OtherExerciseModel;
}
