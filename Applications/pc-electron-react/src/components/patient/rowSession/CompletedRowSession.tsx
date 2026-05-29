import { EyeIcon, RotateCcw, Trash2Icon } from 'lucide-react';
import {
  TemplateRowSession,
  TemplateRowSessionStatus,
} from '@/components/patient/rowSession/TemplateRowSession';
import { SessionWithExerciseCountModel } from '@shared/models/SessionWithExerciseCountModel';
import { BindIdManager } from '@/utils/BindIdManager';
import { BtnIconPatientComponent } from '@/components/patient/BtnIconPatient';

// Interface du composant
export interface CompletedRowSessionComponent {
  id: string;
  session: SessionWithExerciseCountModel;
  onRestartClick: () => void;
  onDetailsClick: () => void;
  onDeleteClick: () => void;
}

/**
 * Composant représentant une session complétée
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function CompletedRowSession(
  dataComponent: CompletedRowSessionComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-CompletedRowSession'
  );

  // --- DATA ---
  // Status de la session
  const status: TemplateRowSessionStatus = {
    text: 'Terminée',
    className: 'bg-[#B5D99A]',
  };

  // Liste des interactions
  const icons: BtnIconPatientComponent[] = [
    {
      id: 'Reload',
      label: 'Relancer',
      icon: <RotateCcw className="w-5 h-5" />,
      onClick: dataComponent.onRestartClick,
    },
    {
      id: 'See',
      label: 'Voir',
      icon: <EyeIcon className="w-5 h-5" />,
      onClick: dataComponent.onDetailsClick,
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
