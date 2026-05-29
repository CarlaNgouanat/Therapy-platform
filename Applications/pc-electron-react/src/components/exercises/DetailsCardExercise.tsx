import { BindIdManager } from '@/utils/BindIdManager';
import { ExerciseModel } from '@shared/models/ExerciseModel';
import { TemplateCardExercise } from './TemplateCardExercise';

// Inteface du composant
export interface DetailsCardExerciseComponent {
  id: string;
  exercise: ExerciseModel;
  onClick: () => void;
}

/**
 * Composant d'une carte avec un exercise (preview)
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function DetailsCardExercise(
  dataComponent: DetailsCardExerciseComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-TemplateCardExercise'
  );

  // --- COMPOSANT ---
  return (
    <TemplateCardExercise
      id={bindId.bindId(1, 'TemplateCardExercise')}
      exercise={dataComponent.exercise}
      onClick={dataComponent.onClick}
      buttons={[]}
    />
  );
}
