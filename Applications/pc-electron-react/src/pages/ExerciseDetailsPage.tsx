// Base
import { BindIdManager } from '@/utils/BindIdManager';
import React from 'react';

/**
 * Page d'affichage des détails d'un exercice
 * @returns Renvoie un composant
 */
export default function ExerciseDetailsPage(): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager('ExerciseDetailsPage');

  // --- COMPOSANT ---
  return (
    <>
      <p id={bindId.bindId(1, 'TextPlaceholder')}>
        Dans cette page, il y aura les détails de l&apos;exercice
      </p>
    </>
  );
}
