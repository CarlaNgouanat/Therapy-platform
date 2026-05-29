import { EyeIcon, Pencil, PlayIcon, Trash2Icon } from 'lucide-react';
import {
  TemplateRowSession,
  TemplateRowSessionStatus,
} from '@/components/patient/rowSession/TemplateRowSession';
import { SessionWithExerciseCountModel } from '@shared/models/SessionWithExerciseCountModel';
import { BindIdManager } from '@/utils/BindIdManager';
import { BtnIconPatientComponent } from '@/components/patient/BtnIconPatient';

// Interface du composant
export interface LateRowSessionComponent {
  id: string;
  session: SessionWithExerciseCountModel;
  onStartClick: () => void;
  onDetailsClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

/**
 * Composant représentant une session en retard
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function LateRowSession(
  dataComponent: LateRowSessionComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-LateRowSession'
  );

  // --- DATA ---
  // Status de la session
  const status: TemplateRowSessionStatus = {
    text: 'En retard',
    className: 'bg-[#FF9F55]',
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
