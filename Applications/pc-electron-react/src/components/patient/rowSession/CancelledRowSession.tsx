import { EyeIcon, Pencil, PlayIcon, Trash2Icon } from 'lucide-react';
import {
  TemplateRowSession,
  TemplateRowSessionStatus,
} from '@/components/patient/rowSession/TemplateRowSession';
import { SessionWithExerciseCountModel } from '@shared/models/SessionWithExerciseCountModel';
import { BindIdManager } from '@/utils/BindIdManager';
import { BtnIconPatientComponent } from '@/components/patient/BtnIconPatient';

// Interface du composant
export interface CancelledRowSessionComponent {
  id: string;
  session: SessionWithExerciseCountModel;
  onStartClick: () => void;
  onDetailsClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

/**
 * Composant représentant une session en annulée
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function CancelledRowSession(
  dataComponent: CancelledRowSessionComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-CancelledRowSession'
  );

  // --- DATA ---
  // TODO : modifié le status / interactions pour le status "annulé"

  // Status de la session
  const status: TemplateRowSessionStatus = {
    text: 'Annulée',
    className: 'bg-white',
  };

  // Liste des interactions
  const icons: BtnIconPatientComponent[] = [
    {
      id: 'Start',
      label: 'Lancer',
      icon: <PlayIcon className="w-5 h-5" />,
      onClick: dataComponent.onStartClick,
    },
    {
      id: 'See',
      label: 'Voir',
      icon: <EyeIcon className="w-5 h-5" />,
      onClick: dataComponent.onDetailsClick,
    },
    {
      id: 'Edit',
      label: 'Modifier',
      icon: <Pencil className="w-5 h-5" />,
      onClick: dataComponent.onEditClick,
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
