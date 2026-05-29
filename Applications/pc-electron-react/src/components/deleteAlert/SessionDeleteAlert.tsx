import React from 'react';
import { TemplateDeleteAlert } from './TemplateDeleteAlert';
import { BindIdManager } from '@/utils/BindIdManager';
import { SessionModel } from '@shared/models/SessionModel';

// Interface du composant
export interface SessionDeleteAlertComponent {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (session: SessionModel | null) => void;
  deleteSession: SessionModel | null;
}

/**
 * Dialogue de confirmation sur la suppression d'une session
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function SessionDeleteAlert(
  dataComponent: SessionDeleteAlertComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-SessionDeleteAlert'
  );

  // --- COMPOSANT ---
  return (
    <TemplateDeleteAlert
      id={bindId.bindId(1, 'TemplateDeleteAlert')}
      title="Supprimer la séance ?"
      description="Cette action est irréversible. Toutes les données associées à cette séance seront perdues"
      isOpen={dataComponent.isOpen}
      onClose={dataComponent.onClose}
      onDelete={() => dataComponent.onDelete(dataComponent.deleteSession)}
    />
  );
}
