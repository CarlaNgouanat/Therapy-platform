import { BindIdManager } from '@/utils/BindIdManager';
import React from 'react';

// Interface du composant
export interface EmptyStateProps {
  id: string;
  message: string;
}

/**
 * Message pour l'affichage lorsqu'il n'y a pas de données
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function EmptyState(dataComponent: EmptyStateProps): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-EmptyState'
  );

  // --- COMPONENT ---
  return (
    <div
      id={bindId.bindId(1, 'Container')}
      className="text-center text-gray-600"
    >
      <p id={bindId.bindId(2, 'Msg')}>{dataComponent.message}</p>
    </div>
  );
}
