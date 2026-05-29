import { BindIdManager } from '@/utils/BindIdManager';
import { ExerciseModel } from '@shared/models/ExerciseModel';
import {
  CardButtonComponent,
  TemplateCardExercise,
} from './TemplateCardExercise';
import { Play } from 'lucide-react';

// Inteface du composant
export interface StartCardExerciseComponent {
  id: string;
  exercise: ExerciseModel;
  onClick: () => void;
  onStart: () => void;
}

/**
 * Composant d'une carte avec un exercise (start)
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function StartCardExercise(
  dataComponent: StartCardExerciseComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-TemplateCardExercise'
  );

  // --- BUTTON ---
  const buttons: CardButtonComponent[] = [
    {
      icon: <Play className="text-[#1880D9] w-4 h-4" />,
      onClick: dataComponent.onStart,
    },
  ];

  // --- COMPOSANT ---
  return (
    <TemplateCardExercise
      id={bindId.bindId(1, 'TemplateCardExercise')}
      exercise={dataComponent.exercise}
      onClick={dataComponent.onClick}
      buttons={buttons}
    />
  );
}
