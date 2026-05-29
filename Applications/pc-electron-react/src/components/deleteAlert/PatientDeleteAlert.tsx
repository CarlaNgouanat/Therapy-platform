import React from 'react';
import { TemplateDeleteAlert } from './TemplateDeleteAlert';
import { BindIdManager } from '@/utils/BindIdManager';
import { PatientWithInterestsModel } from '@shared/models/PatientWithInterestsModel';

// Interface du composant
export interface PatientDeleteAlertComponent {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (patient: PatientWithInterestsModel | null) => void;
  deletePatient: PatientWithInterestsModel | null;
}

/**
 * Dialogue de confirmation sur la suppression d'un patient
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function PatientDeleteAlert(
  dataComponent: PatientDeleteAlertComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-PatientDeleteAlert'
  );

  // --- COMPOSANT ---
  return (
    <TemplateDeleteAlert
      id={bindId.bindId(1, 'TemplateDeleteAlert')}
      title="Supprimer ce patient ?"
      description="Cette action est irréversible. Toutes les données associées à ce patient seront perdues"
      isOpen={dataComponent.isOpen}
      onClose={dataComponent.onClose}
      onDelete={() => dataComponent.onDelete(dataComponent.deletePatient)}
    />
  );
}
