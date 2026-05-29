import React from 'react';
import { TemplateDeleteAlert } from './TemplateDeleteAlert';
import { BindIdManager } from '@/utils/BindIdManager';
import { SessionExerciseWithExerciseModel } from '@shared/models/SessionExerciseWithExerciseModel';

// Interface du composant
export interface ExerciseDeleteAlertComponent {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (exercice: SessionExerciseWithExerciseModel | null) => void;
  deleteExercise: SessionExerciseWithExerciseModel | null;
}

/**
 * Dialogue de confirmation sur la suppression d'un exercice
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function ExerciseDeleteAlert(
  dataComponent: ExerciseDeleteAlertComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-ExerciseDeleteAlert'
  );

  // --- COMPOSANT ---
  return (
    <TemplateDeleteAlert
      id={bindId.bindId(1, 'TemplateDeleteAlert')}
      title="Supprimer l'exercice ?"
      description="Cette action est irréversible. Toutes les données associées à cette exercice seront perdues"
      isOpen={dataComponent.isOpen}
      onClose={dataComponent.onClose}
      onDelete={() => dataComponent.onDelete(dataComponent.deleteExercise)}
    />
  );
}
