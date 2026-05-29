import { SessionWithExerciseCountModel } from '@shared/models/SessionWithExerciseCountModel';
import { BindIdManager } from '@/utils/BindIdManager';
import { formatDateLong, formatTime } from '@/utils/DateUtils';
import {
  BtnIconPatient,
  BtnIconPatientComponent,
} from '@/components/patient/BtnIconPatient';

// Interface sur le status de la session
export interface TemplateRowSessionStatus {
  text: string;
  className: string;
}

// Interface du composant
export interface TemplateRowSessionComponent {
  id: string;
  session: SessionWithExerciseCountModel;
  status: TemplateRowSessionStatus;
  icons: BtnIconPatientComponent[];
}

/**
 * Ligne pour une séance
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function TemplateRowSession(
  dataComponent: TemplateRowSessionComponent
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-TemplateRowSession'
  );

  // --- COMPOSANT ---
  return (
    <div
      id={bindId.bindId(1, 'MainContainerRowSession')}
      className="w-full px-6 py-3 grid grid-cols-2 items-center justify-center bg-[#f1f2f3] border-1 rounded-lg"
    >
      <div
        id={bindId.bindId(2, 'DataContainer')}
        className="flex flex-col gap-2"
      >
        <p
          id={bindId.bindId(3, 'DateSession')}
          className="text-base font-bold text-left"
        >
          Séance du {formatDateLong(new Date(dataComponent.session.date))} à{' '}
          {formatTime(new Date(dataComponent.session.date))}
        </p>
        <p
          id={bindId.bindId(3, 'NbExerciseSession')}
          className="text-base text-left"
        >
          {dataComponent.session.exerciseCount} exercice
          {dataComponent.session.exerciseCount > 1 ? 's' : ''}
        </p>
      </div>

      <div
        id={bindId.bindId(2, 'StatusAndBtnContainer')}
        className="flex justify-between items-center w-full"
      >
        <p
          id={bindId.bindId(3, 'Status')}
          className={
            'text-base px-3 py-2 rounded-sm ' + dataComponent.status.className
          }
        >
          {dataComponent.status.text}
        </p>

        <div
          id={bindId.bindId(3, 'BtnContainer')}
          className="flex justify-center items-center gap-2"
        >
          {dataComponent.icons.map(
            (icon: BtnIconPatientComponent, index: number) => (
              <BtnIconPatient
                key={index}
                id={bindId.bindId(4, 'Btn' + icon.id)}
                onClick={icon.onClick}
                label={icon.label}
                icon={icon.icon}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
