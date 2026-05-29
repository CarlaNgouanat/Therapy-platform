import { BindIdManager } from '@/utils/BindIdManager';
import { ExerciseModel } from '@shared/models/ExerciseModel';
import {
  CardButtonComponent,
  TemplateCardExercise,
} from './TemplateCardExercise';
import { Pencil, Trash2Icon } from 'lucide-react';

// Inteface du composant
export interface EditCardExerciseComponent {
  id: string;
  exercise: ExerciseModel;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Composant d'une carte avec un exercise (start)
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function EditCardExercise(
  dataComponent: EditCardExerciseComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-TemplateCardExercise'
  );

  // --- BUTTON ---
  const buttons: CardButtonComponent[] = [
    {
      icon: <Pencil className="text-[#1880D9] w-4 h-4" />,
      onClick: dataComponent.onEdit,
    },
    {
      icon: <Trash2Icon className="text-[#1880D9] w-4 h-4" />,
      onClick: dataComponent.onDelete,
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
