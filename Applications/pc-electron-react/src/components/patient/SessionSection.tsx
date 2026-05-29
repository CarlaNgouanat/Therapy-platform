import React from 'react';
import { SessionWithExerciseCountModel } from '@shared/models/SessionWithExerciseCountModel';
import { CancelledRowSession } from './rowSession/CancelledRowSession';
import { CompletedRowSession } from './rowSession/CompletedRowSession';
import { InProgressRowSession } from './rowSession/InProgressRowSession';
import { LateRowSession } from './rowSession/LateRowSession';
import { PlannedRowSession } from './rowSession/PlannedRowSession';
import { BindIdManager } from '@/utils/BindIdManager';
import { AddRowSession } from './rowSession/AddRowSession';

// Interface du composant
export interface SectionHeaderProps {
  id: string;
  title: string;
  sessions: SessionWithExerciseCountModel[];
  onStartClick: (session: SessionWithExerciseCountModel) => void;
  onDetailsClick: (session: SessionWithExerciseCountModel) => void;
  onEditClick: (session: SessionWithExerciseCountModel) => void;
  onDeleteClick: (session: SessionWithExerciseCountModel) => void;
  onContinueClick: (session: SessionWithExerciseCountModel) => void;
  onAddClick?: () => void;
}

// --- FONCTION ---

function displayRowSession(
  id: string,
  dataComponent: SectionHeaderProps,
  session: SessionWithExerciseCountModel
): JSX.Element {
  switch (session.status) {
    case 'CANCELLED':
      return (
        <CancelledRowSession
          id={id + '-CancelledRowSession'}
          session={session}
          onStartClick={() => dataComponent.onStartClick(session)}
          onDetailsClick={() => dataComponent.onDetailsClick(session)}
          onEditClick={() => dataComponent.onEditClick(session)}
          onDeleteClick={() => dataComponent.onDeleteClick(session)}
        />
      );
    case 'COMPLETED':
      return (
        <CompletedRowSession
          id={id + '-CompletedRowSession'}
          session={session}
          onRestartClick={() => dataComponent.onStartClick(session)}
          onDetailsClick={() => dataComponent.onDetailsClick(session)}
          onDeleteClick={() => dataComponent.onDeleteClick(session)}
        />
      );
    case 'IN_PROGRESS':
      return (
        <InProgressRowSession
          id={id + '-InProgressRowSession'}
          session={session}
          onOpenLink={() => dataComponent.onContinueClick(session)}
          onDeleteClick={() => dataComponent.onDeleteClick(session)}
        />
      );
    case 'LATE':
      return (
        <LateRowSession
          id={id + '-LateRowSession'}
          session={session}
          onStartClick={() => dataComponent.onStartClick(session)}
          onDetailsClick={() => dataComponent.onDetailsClick(session)}
          onEditClick={() => dataComponent.onEditClick(session)}
          onDeleteClick={() => dataComponent.onDeleteClick(session)}
        />
      );
    case 'PLANNED':
      return (
        <PlannedRowSession
          id={id + '-PlannedRowSession'}
          session={session}
          onStartClick={() => dataComponent.onStartClick(session)}
          onDetailsClick={() => dataComponent.onDetailsClick(session)}
          onEditClick={() => dataComponent.onEditClick(session)}
          onDeleteClick={() => dataComponent.onDeleteClick(session)}
        />
      );
    default:
      return <></>;
  }
}

// --- COMPOSANT ---

/**
 * Section d'un ensemble de section pour un patient
 * @param dataComponent Données du composant
 * @returns Renvoie un composant
 */
export function SessionSection(
  dataComponent: SectionHeaderProps
): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    dataComponent.id + '-SessionSection'
  );

  // --- COMPOSANT ---
  return (
    <div
      id={bindId.bindId(1, 'MainContainer')}
      className="flex flex-col gap-4 w-full"
    >
      <h1 id={bindId.bindId(2, 'Titre')} className="text-xl font-bold">
        {dataComponent.title}
      </h1>
      <div
        id={bindId.bindId(2, 'SessionContainer')}
        className="flex flex-col gap-2 w-full"
      >
        {dataComponent.onAddClick !== undefined ? (
          <AddRowSession
            id={bindId.bindId(3, 'AddSession')}
            onClick={dataComponent.onAddClick}
          />
        ) : undefined}
        {dataComponent.sessions.map((session: SessionWithExerciseCountModel) =>
          displayRowSession(
            bindId.bindId(3, 'Session' + session.id),
            dataComponent,
            session
          )
        )}
      </div>
    </div>
  );
}
