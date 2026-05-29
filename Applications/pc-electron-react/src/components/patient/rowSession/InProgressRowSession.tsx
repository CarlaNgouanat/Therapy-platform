import { ExternalLink, Trash2Icon } from 'lucide-react';
import {
  TemplateRowSession,
  TemplateRowSessionStatus,
} from '@/components/patient/rowSession/TemplateRowSession';
import { SessionWithExerciseCountModel } from '@shared/models/SessionWithExerciseCountModel';
import { BindIdManager } from '@/utils/BindIdManager';
import { BtnIconPatientComponent } from '@/components/patient/BtnIconPatient';

// Interface du composant
export interface InProgressRowSessionComponent {
  id: string;
  session: SessionWithExerciseCountModel;
  onOpenLink: () => void;
  onDeleteClick: () => void;
}

/**
 * Composant représentant une session en cours
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function InProgressRowSession(
  dataComponent: InProgressRowSessionComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-InProgressRowSession'
  );

  // --- DATA ---
  // Status de la session
  const status: TemplateRowSessionStatus = {
    text: 'En cours',
    className: 'bg-[#99DEF1]',
  };

  // Liste des interactions
  const icons: BtnIconPatientComponent[] = [
    {
      id: 'Open',
      label: 'Ouvrir',
      icon: <ExternalLink className="w-5 h-5" />,
      onClick: dataComponent.onOpenLink,
    },
    {
      id: 'Delete',
      label: 'Supprimer',
      icon: <Trash2Icon className="w-5 h-5" />,
      onClick: dataComponent.onDeleteClick,
    },
  ];

  // --- COMPOSANT ---
  return (
    <TemplateRowSession
      id={bindId.bindId(1, 'RowSession')}
      status={status}
      icons={icons}
      session={dataComponent.session}
    />
  );
}
