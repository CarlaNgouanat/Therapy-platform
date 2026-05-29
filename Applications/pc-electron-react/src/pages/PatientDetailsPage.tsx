// Base
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavigateFunction } from 'react-router';
import { differenceInYears } from 'date-fns';
import { formatDateShort } from '@/utils/DateUtils';
// Types
// Composants shadcn/ui
// Composants internes
import PatientDialog from '@/components/patients/PatientDialog';
import { DataCard } from '@/components/DataCard';
import { SessionSection } from '@/components/patient/SessionSection';
import { useActiveSession } from '@/contexts/UseActiveSession';
// Icônes
import { Pencil, Trash2Icon } from 'lucide-react';
import { SessionWithExerciseCountModel } from '@shared/models/SessionWithExerciseCountModel';
import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';
import { PatientWithInterestsModel } from '@shared/models/PatientWithInterestsModel';
import { SessionModel } from '@shared/models/SessionModel';
import { BindIdManager } from '@/utils/BindIdManager';
import { BtnIconPatient } from '@/components/patient/BtnIconPatient';
import { PatientGender } from '@shared/types/PatientGender';
import { InterestChipItemPatient } from '@/components/patient/itemPatient/InterestChipItemPatient';
import { RoutesManager } from '@/utils/RoutesManager';
import { InfoItemPatient } from '@/components/patient/itemPatient/InfoItemPatient';
import { SessionDialog } from '@/components/session/SessionDialog';
import { SessionDeleteAlert } from '@/components/deleteAlert/SessionDeleteAlert';
import { PatientDeleteAlert } from '@/components/deleteAlert/PatientDeleteAlert';
import ConflictDialog from '@/components/activeSession/ConflictDialog';
import { ExoModeType } from '@shared/types/ExoModeType';

// --- FONCTIONS ---
// --- PATIENTS ---

/**
 * Récupère les informations d'un patient
 * @param patientId Identifiant du patient
 * @returns Renvoie une promesse avec la liste des exercices au format PatientWithInterestsModel
 */
async function fetchPatient(
  patientId: number
): Promise<PatientWithInterestsModel> {
  return await window.electronAPI.patientGetPatientWithInterestsById({
    id: patientId,
  } as DBRequestIdModel);
}

/**
 * Renvoie les séances d'un patient
 * @param patientId Identifiant du patient
 * @returns Renvoie une promesse avec la liste des exercices au format SessionWithExerciseCountModel
 */
async function fetchPatientSessions(
  patientId: number
): Promise<SessionWithExerciseCountModel[]> {
  return await window.electronAPI.sessionGetByPatient({
    id: patientId,
  } as DBRequestIdModel);
}

/**
 * Met à jour les données du patient dans la base de données
 * @param patientData Données du patient à modifier
 * @returns Renvoie une promesse avec les nouvelles données du patient
 */
async function handleUpdatePatient(
  patientData: PatientWithInterestsModel
): Promise<PatientWithInterestsModel> {
  await window.electronAPI.patientUpdatePatient(patientData);
  // TODO : Utiliser ce que renvoie la fonction pour donner des feedbacks ?

  return patientData;
}

/**
 * Supprime le patient de la base de données
 * @param patientData Données du patient à supprimer
 */
async function handleDeletePatient(
  navigate: NavigateFunction,
  patientData: PatientWithInterestsModel
): Promise<void> {
  await window.electronAPI.patientDeleteById({
    id: patientData.id,
  } as DBRequestIdModel);
  // TODO : Utiliser ce que renvoie la fonction pour donner des feedbacks ?

  navigatePatients(navigate);
}

// --- SESSIONS ---

/**
 * Crée une nouvelle session dans la base de données
 * @param patientData Données courant du patient
 * @param session Session à sauvegarder
 * @returns Renvoie une liste avec toutes les sessions
 */
async function handleSaveSession(
  patientData: PatientWithInterestsModel,
  session: SessionModel
): Promise<SessionWithExerciseCountModel[]> {
  await window.electronAPI.sessionCreateSession(session);
  return await window.electronAPI.sessionGetByPatient({
    id: patientData.id,
  } as DBRequestIdModel);
}

/**
 * Supprime une session de la base de données
 * @param patientData Données courant du patient
 * @param session Session à supprimer
 * @returns Renvoie une liste avec toutes les sessions
 */
async function handleDeleteSession(
  patientData: PatientWithInterestsModel,
  session: SessionModel
): Promise<SessionWithExerciseCountModel[]> {
  await window.electronAPI.sessionDeleteById({
    id: session.id,
  } as DBRequestIdModel);
  // TODO : Utiliser ce que renvoie la fonction pour donner des feedbacks ?

  return await window.electronAPI.sessionGetByPatient({
    id: patientData.id,
  } as DBRequestIdModel);
}

// --- FORMAT ---

/**
 * Formate le label sur le genre du patient
 * @param gender Genre du patient
 * @returns Texte formaté
 */
function formatGender(gender: PatientGender): string {
  switch (gender) {
    case 'MALE':
      return 'Homme';
    case 'FEMALE':
      return 'Femme';
    default:
      return 'Autre';
  }
}
/**
 * Formate le label sur la date d'anniversaire
 * @param date Date de naissance du patient
 * @returns Texte formaté
 */
function formatBirthDate(date: Date): string {
  return `${formatDateShort(date)} (${differenceInYears(new Date(), date)} ans)`;
}

// --- NAVIGATION ---

/**
 * Navigation vers la liste des patients
 * @param navigate Objet de navigation
 */
function navigatePatients(navigate: NavigateFunction): void {
  // Navigation vers la nouvelle page
  const path: string | null = RoutesManager.navigateTo('patients');
  if (path !== null) {
    navigate(path);
  }
  // TODO : gérer le cas où path == null
}

/**
 * Navigation vers une session
 * @param navigate Objet de navigation
 * @param patient Données d'un patient
 * @param session Données d'une session
 */
function navigateSession(
  navigate: NavigateFunction,
  patient: PatientWithInterestsModel,
  session: SessionModel,
  exoMode: ExoModeType
) {
  // Navigation vers la nouvelle page
  const path: string | null = RoutesManager.navigateTo(
    'session',
    String(patient.id),
    String(session.id),
    exoMode
  );
  if (path !== null) {
    navigate(path);
  }
  // TODO : gérer le cas où path == null
}

/**
 * Page d'affichage des détails d'un patient
 * @returns Revoie un composant
 */
export default function PatientDetailsPage(): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager('PatientDetailsPage');

  // --- NAVIGATION ---
  const navigate: NavigateFunction = useNavigate();

  // --- ACTIVE SESSION ---
  const { startSession, refreshActiveSession, activeSession } =
    useActiveSession();

  // --- PATIENT ---
  // Récupération de l'identifiant du patient depuis les paramètres d'URL
  const { patientId } = useParams<{ patientId: string }>();

  // Information du patient
  const [patient, setPatient] = useState<PatientWithInterestsModel | null>(
    null
  );
  const [selectDeletePatient, setSelectDeletePatient] =
    useState<PatientWithInterestsModel | null>(null);

  // Informations sur les sessions du patient
  const [sessions, setSessions] = useState<SessionWithExerciseCountModel[]>([]);
  const [selectDeleteSession, setSelectDeleteSession] =
    useState<SessionWithExerciseCountModel | null>(null);

  // Conflit sur le lancement d'une session
  const [conflictSession, setConflictSession] = useState<SessionModel | null>(
    null
  );

  // --- DIALOG ---
  // Gestion de l'ouverture du dialogue d'édition du patient
  const [isEditPatientDialogOpen, setIsEditPatientDialogOpen] = useState(false);

  // Gestion de l'ouverture du dialogue de création/édition de séance
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);

  // Gestion de l'ouverture du dialogue sur l'alert de suppression d'un patient
  const [isAlertPatient, setIsAlertPatient] = useState(false);

  // Gestion de l'ouverture du dialogue sur l'alert de suppression d'une séance
  const [isAlertSession, setIsAlertSession] = useState(false);

  // Gestion de l'ouverture du dialogue sur l'alert de lancement d'une session
  const [isStartConflictDialogOpen, setIsStartConflictDialogOpen] =
    useState(false);

  // --- USE EFFECT ---
  // Au chargement, récupération de la liste des patients et de ses sessions
  useEffect(() => {
    if (patientId !== undefined) {
      fetchPatient(Number(patientId))
        .then((patient: PatientWithInterestsModel) => {
          setPatient(patient);
          fetchPatientSessions(Number(patientId)).then(
            (sessions: SessionWithExerciseCountModel[]) => {
              setSessions(sessions);
            }
          );
        })
        .catch((error: Error) => {
          console.log(error);
          // TODO : cas où le patient n'existe pas
        });
    } else {
      // TODO : cas où le patient n'existe pas
    }
  }, [patientId]);

  const sessionPlanned: SessionWithExerciseCountModel[] = sessions.filter(
    (session: SessionWithExerciseCountModel) => {
      return (
        session.status === 'PLANNED' ||
        session.status === 'IN_PROGRESS' ||
        session.status === 'LATE'
      );
    }
  );
  const sessionHistoric: SessionWithExerciseCountModel[] = sessions.filter(
    (session: SessionWithExerciseCountModel) => {
      return session.status === 'COMPLETED' || session.status === 'CANCELLED';
    }
  );

  // Affichage pendant le chargement des données
  if (!patient) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="h-full flex flex-col gap-5">
      <DataCard className="flex flex-col gap-5 p-5">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">
              {patient.firstName} {patient.lastName}
            </h1>
            <div className="flex gap-2 justify-center items-center">
              <BtnIconPatient
                id={bindId.bindId(4, 'BtnEdit')}
                onClick={() => setIsEditPatientDialogOpen(true)}
                label={'Éditer'}
                icon={<Pencil className="w-5 h-5" />}
              />
              <BtnIconPatient
                id={bindId.bindId(4, 'BtnDelete')}
                onClick={() => {
                  if (patient !== null) {
                    setSelectDeletePatient(patient);
                    setIsAlertPatient(true);
                  }
                }}
                label={'Supprimer'}
                icon={<Trash2Icon className="w-5 h-5" />}
              />
            </div>
          </div>

          <div className="flex justify-start gap-8">
            <InfoItemPatient
              id=""
              label="Genre"
              value={formatGender(patient.gender)}
            />
            <InfoItemPatient
              id=""
              label="Date de naissance"
              value={formatBirthDate(patient.birthDate)}
            />
            <InfoItemPatient
              id=""
              label="Nombre de séances"
              value={String(sessions.length)}
            />
          </div>
        </div>

        <InterestChipItemPatient
          id=""
          label="Intérêts"
          values={patient.interests}
        />

        <InfoItemPatient
          id=""
          label="Notes"
          value={
            patient.notes !== '' ? patient.notes : 'Aucune note pour le moment'
          }
        />
      </DataCard>

      <DataCard className="flex flex-col gap-6 p-5">
        <SessionSection
          id=""
          title={'Séances planifiées (' + sessionPlanned.length + ')'}
          sessions={sessionPlanned}
          onAddClick={() => setIsSessionDialogOpen(true)}
          onStartClick={async (session: SessionWithExerciseCountModel) => {
            if (patient !== undefined) {
              if (activeSession !== null) {
                setConflictSession(session);
                setIsStartConflictDialogOpen(true);
              } else {
                await startSession(session);
                navigateSession(navigate, patient, session, 'IN_PROGRESS');
              }
            }
          }}
          onContinueClick={(session: SessionWithExerciseCountModel) => {
            if (patient !== undefined)
              navigateSession(navigate, patient, session, 'IN_PROGRESS');
          }}
          onDetailsClick={(session: SessionWithExerciseCountModel) => {
            if (patient !== undefined)
              navigateSession(navigate, patient, session, 'PREVIEW');
          }}
          onEditClick={(session: SessionWithExerciseCountModel) => {
            if (patient !== undefined)
              navigateSession(navigate, patient, session, 'EDIT');
          }}
          onDeleteClick={(session: SessionWithExerciseCountModel) => {
            setSelectDeleteSession(session);
            setIsAlertSession(true);
          }}
        />
        <SessionSection
          id=""
          title={'Historique (' + sessionHistoric.length + ')'}
          sessions={sessionHistoric}
          onStartClick={async (session: SessionWithExerciseCountModel) => {
            if (patient !== undefined) {
              if (activeSession !== null) {
                setConflictSession(session);
                setIsStartConflictDialogOpen(true);
              } else {
                await startSession(session);
                navigateSession(navigate, patient, session, 'IN_PROGRESS');
              }
            }
          }}
          onContinueClick={(session: SessionWithExerciseCountModel) => {
            if (patient !== undefined)
              navigateSession(navigate, patient, session, 'IN_PROGRESS');
          }}
          onDetailsClick={(session: SessionWithExerciseCountModel) => {
            if (patient !== undefined)
              navigateSession(navigate, patient, session, 'PREVIEW');
          }}
          onEditClick={(session: SessionWithExerciseCountModel) => {
            if (patient !== undefined)
              navigateSession(navigate, patient, session, 'EDIT');
          }}
          onDeleteClick={(session: SessionWithExerciseCountModel) => {
            setSelectDeleteSession(session);
            setIsAlertSession(true);
          }}
        />
      </DataCard>

      {/* Dialogues de création ou de modification */}
      <PatientDialog
        id=""
        isOpen={isEditPatientDialogOpen}
        onClose={() => setIsEditPatientDialogOpen(false)}
        onSave={(newDataPatient) => {
          if (patient !== null) {
            handleUpdatePatient(newDataPatient);
            setPatient(newDataPatient);
          }
        }}
        initialPatient={patient || undefined}
      />
      <SessionDialog
        id=""
        isOpen={isSessionDialogOpen}
        onClose={() => setIsSessionDialogOpen(false)}
        onSave={async (newSession) => {
          if (patient !== null) {
            const sessions: SessionWithExerciseCountModel[] =
              await handleSaveSession(patient, {
                id: -1,
                createdAt: new Date(),
                date: newSession.date,
                notes: newSession.notes,
                patientId: patient.id,
                status: 'PLANNED',
              } as SessionModel);
            setSessions(sessions);
          }
        }}
        initialSession={null}
      />

      {/* Dialogue d'alerte */}
      <PatientDeleteAlert
        id=""
        isOpen={isAlertPatient}
        onClose={() => setIsAlertPatient(false)}
        onDelete={async (patient: PatientWithInterestsModel | null) => {
          if (patient !== null) {
            await handleDeletePatient(navigate, patient);
            await refreshActiveSession();
            setIsAlertPatient(false);
          }
        }}
        deletePatient={selectDeletePatient}
      />
      <SessionDeleteAlert
        id=""
        isOpen={isAlertSession}
        onClose={() => setIsAlertSession(false)}
        onDelete={async (session: SessionModel | null) => {
          if (patient !== null && session !== null) {
            const sessions: SessionWithExerciseCountModel[] =
              await handleDeleteSession(patient, session);
            await refreshActiveSession();
            setSessions(sessions);
            setIsAlertSession(false);
          }
        }}
        deleteSession={selectDeleteSession}
      />
      <ConflictDialog
        id=""
        isOpen={isStartConflictDialogOpen}
        onClose={() => setIsStartConflictDialogOpen(false)}
        onStartAnyway={async (session: SessionModel | null) => {
          if (patient !== null && session !== null) {
            await startSession(session);
            navigateSession(navigate, patient, session, 'IN_PROGRESS');
            setIsStartConflictDialogOpen(false);
            // TODO : gérer le cas de fail sur le lancement
          }
        }}
        conflictSession={conflictSession}
      />
    </div>
  );
}
