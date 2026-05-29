import { BindIdManager } from '@/utils/BindIdManager';
import { PlusIcon } from 'lucide-react';

// Interface du composant
export interface AddRowSessionComponent {
  id: string;
  onClick: () => void;
}

// --- COMPOSANT ---

/**
 * Composant affichant un bouton d'ajout de session
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function AddRowSession(
  dataComponent: AddRowSessionComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-AddRowSession'
  );

  // --- COMPOSANT ---
  return (
    <button
      id={bindId.bindId(1, 'AddButton')}
      onClick={dataComponent.onClick}
      className="w-full px-6 py-3 flex items-center justify-center bg-[#f1f2f3] border-1 rounded-lg"
    >
      <PlusIcon className="w-8 h-8" />
    </button>
  );
}
