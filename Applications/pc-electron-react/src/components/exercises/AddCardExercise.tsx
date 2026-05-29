import { PlusIcon } from 'lucide-react';
import { TemplateCard } from '@/components/exercises/TemplateCard';
import { BindIdManager } from '@/utils/BindIdManager';

// Inteface du composant
export interface AddCardExerciseType {
  id: string;
  onClick: () => void;
}

/**
 * Composant d'une carte avec un plus
 * @param addCard Donnée utile à la carte d'ajout
 * @returns Renvoie un composant
 */
export function AddCardExercise(
  addCard: AddCardExerciseType
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    addCard.id + '-AddCardExercise'
  );

  // --- COMPOSANT ---
  return (
    <TemplateCard
      id={bindId.bindId(1, 'TemplateCard')}
      child={
        <button
          id={bindId.bindId(2, 'ButtonAdd')}
          className="w-full h-full flex items-center justify-center bg-[#f1f2f3]"
          onClick={() => addCard.onClick()}
        >
          <PlusIcon
            id={bindId.bindId(3, 'Icon')}
            className="w-[156px] h-[156px] text-gray-600"
          />
        </button>
      }
    ></TemplateCard>
  );
}
