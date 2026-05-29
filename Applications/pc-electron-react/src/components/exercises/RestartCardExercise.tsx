import { BindIdManager } from '@/utils/BindIdManager';
import { ExerciseModel } from '@shared/models/ExerciseModel';
import {
  CardButtonComponent,
  TemplateCardExercise,
} from './TemplateCardExercise';
import { RotateCcw } from 'lucide-react';

// Inteface du composant
export interface RestartCardExerciseComponent {
  id: string;
  exercise: ExerciseModel;
  onClick: () => void;
  onRestart: () => void;
}

/**
 * Composant d'une carte avec un exercise (restart)
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function RestartCardExercise(
  dataComponent: RestartCardExerciseComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-TemplateCardExercise'
  );

  // --- BUTTON ---
  const buttons: CardButtonComponent[] = [
    {
      icon: <RotateCcw className="text-[#1880D9] w-4 h-4" />,
      onClick: dataComponent.onRestart,
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
