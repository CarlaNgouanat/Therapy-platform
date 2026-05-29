import { ActiveExercisePanel } from '@/components/ActiveExercisePanel';
import { DataCard } from '@/components/DataCard';
import { ExerciseDeleteAlert } from '@/components/deleteAlert/ExerciseDeleteAlert';
import { SessionDeleteAlert } from '@/components/deleteAlert/SessionDeleteAlert';
import { AddCardExercise } from '@/components/exercises/AddCardExercise';
import { DetailsCardExercise } from '@/components/exercises/DetailsCardExercise';
import { EditCardExercise } from '@/components/exercises/EditCardExercise';
import { RestartCardExercise } from '@/components/exercises/RestartCardExercise';
import { StartCardExercise } from '@/components/exercises/StartCardEexercise';
import { BtnIconPatient } from '@/components/patient/BtnIconPatient';
import { InfoItemPatient } from '@/components/patient/itemPatient/InfoItemPatient';
import { SessionDialog } from '@/components/session/SessionDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useActiveSession } from '@/contexts/UseActiveSession';
import { BindIdManager } from '@/utils/BindIdManager';
import { RoutesManager } from '@/utils/RoutesManager';
import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';
import { ExerciseModel } from '@shared/models/ExerciseModel';
import { ExerciseWithInterestsModel } from '@shared/models/ExerciseWithInterestsModel';
import { PatientModel } from '@shared/models/PatientModel';
import { PatientWithInterestsModel } from '@shared/models/PatientWithInterestsModel';
import { SessionExerciseWithExerciseModel } from '@shared/models/SessionExerciseWithExerciseModel';
import { SessionModel } from '@shared/models/SessionModel';
import { SFAExerciseModel } from '@shared/models/exercises/SFAExerciseModel';
import { ExoModeType } from '@shared/types/ExoModeType';
import { formatDateLong, formatTime } from '@/utils/DateUtils';
import { Pencil, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router';

// --- CONSTANTES ---

const SFA_FIELDS = [
  {
    key: 'sfaCategory' as keyof SFAExerciseModel,
    label: 'Catégorie',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    key: 'sfaUse' as keyof SFAExerciseModel,
    label: 'Usage',
    color: 'bg-green-100 text-green-800',
  },
  {
    key: 'sfaAction' as keyof SFAExerciseModel,
    label: 'Action',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    key: 'sfaProperties' as keyof SFAExerciseModel,
    label: 'Propriétés',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    key: 'sfaAssociation' as keyof SFAExerciseModel,
    label: 'Association',
    color: 'bg-orange-100 text-orange-800',
  },
];

// --- FONCTIONS ---

/**
 * Renvoie les données du patient courant
 * @param patientId Identifiant du patient
 * @returns Renvoie les données au format PatientWithInterestsModel
 */
async function fetchPatient(
  patientId: number
): Promise<PatientWithInterestsModel> {
  return await window.electronAPI.patientGetPatientWithInterestsById({
    id: patientId,
  } as DBRequestIdModel);
}

/**
 * Renvoie les données des exercices de la séance
 * @param sessionId Identifiant de la séance
 * @returns Renvoie les données sour la forme d'un tableau de SessionExerciseWithExerciseModel
 */
async function fetchExercises(
  sessionId: number
): Promise<SessionExerciseWithExerciseModel[]> {
  return await window.electronAPI.sessionExerciseGetExercisesForSession({
    id: sessionId,
  } as DBRequestIdModel);
}

/**
 * Renvoie les données de la session courante
 * @param sessionId Identifiant de la session
 * @returns Renvoie les données au format SessionModel
 */
async function fetchSession(sessionId: number): Promise<SessionModel> {
  return await window.electronAPI.sessionGetById({
    id: sessionId,
  } as DBRequestIdModel);
}

async function fetchAllExercises(): Promise<ExerciseWithInterestsModel[]> {
  return await window.electronAPI.exerciseGetAllExercisesWithInterests();
}

// --- SESSION ---

/**
 * Met à jour les données d'une session dans la base de données
 * @param patientData Données courant du patient
 * @param session Session à modifier
 * @returns Renvoie une liste avec toutes les sessions
 */
async function handleUpdateSession(
  session: SessionModel
): Promise<SessionModel> {
  console.log(session);
  await window.electronAPI.sessionUpdateSession(session);
  // TODO : Utiliser ce que renvoie la fonction pour donner des feedbacks ?

  return session;
}

/**
 * Supprime une session de la base de données
 * @param patientData Données courant du patient
 * @param session Session à supprimer
 * @returns Renvoie une liste avec toutes les sessions
 */
async function handleDeleteSession(
  navigate: NavigateFunction,
  patientData: PatientModel,
  session: SessionModel
): Promise<void> {
  await window.electronAPI.sessionDeleteById({
    id: session.id,
  } as DBRequestIdModel);

  // Redirection vers la page du patient
  const patientPath: string | null = RoutesManager.navigateTo(
    'patient',
    String(patientData.id)
  );
  if (patientPath !== null) navigate(patientPath);
}

// --- EXERCICE ---

/**
 * Supprime une session de la base de données
 * @param patientData Données courant du patient
 * @param session Session à supprimer
 * @returns Renvoie une liste avec toutes les sessions
 */
async function handleDeleteExercise(
  session: SessionModel,
  exercise: SessionExerciseWithExerciseModel
): Promise<SessionExerciseWithExerciseModel[]> {
  await window.electronAPI.sessionExerciseDeleteById({
    id: exercise.id,
  } as DBRequestIdModel);
  return await fetchExercises(session.id);
}

// --- CARD ---

/**
 * Affiche une carte dans la session
 * @param id Identifiant de la carte
 * @param exercise Données de l'exercice
 * @param exoMode Mode d'affichage
 * @param onDetails Fonction vers le détail de l'exercice
 * @param onStart Fonction vers le début de l'exercice
 * @param onEdit Fonction vers l'éditien de l'exercice
 * @param onDelete Fonction vers la suppression de l'exercice
 * @returns Renvoie un composant
 */
function displayCard(
  id: string,
  sessionExercise: SessionExerciseWithExerciseModel,
  exoMode: ExoModeType | undefined,
  onDetails: () => void,
  onStart: () => void,
  onEdit: () => void,
  onDelete: () => void
) {
  switch (exoMode) {
    case 'PREVIEW':
      return (
        <DetailsCardExercise
          id={id + '-Preview'}
          exercise={sessionExercise.exercise}
          onClick={() => onDetails()}
        />
      );
    case 'IN_PROGRESS':
      if (sessionExercise.status === 'DONE') {
        return (
          <RestartCardExercise
            id={id + '-InProgress'}
            exercise={sessionExercise.exercise}
            onClick={() => onDetails()}
            onRestart={() => onStart()}
          />
        );
      } else {
        return (
          <StartCardExercise
            id={id + '-InProgress'}
            exercise={sessionExercise.exercise}
            onClick={() => onDetails()}
            onStart={() => onStart()}
          />
        );
      }
    case 'EDIT':
      return (
        <EditCardExercise
          id={id + '-Edit'}
          exercise={sessionExercise.exercise}
          onClick={() => onDetails()}
          onEdit={() => onEdit()}
          onDelete={() => onDelete()}
        />
      );
    default:
      return <></>;
  }
}

// --- COMPOSANT ---

/**
 * Page sur le détail de lasession d'un exercice
 * @returns Renvoie un composant
 */
export function SessionDetailsPage(): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager('SessionDetailsPage');

  // --- NAVIGATION ---
  const navigate: NavigateFunction = useNavigate();

  // --- ACTIVE SESSION ---
  const { refreshActiveSession } = useActiveSession();

  // --- GET PARAMETRE ---
  // Récupération des identifiants depuis les paramètres d'URL
  const { patientId, sessionId, exoMode } = useParams<{
    patientId: string;
    sessionId: string;
    exoMode: ExoModeType;
  }>();

  // --- PATIENT ---
  const [patient, setPatient] = useState<PatientWithInterestsModel | null>(
    null
  );

  // --- SESSION ---
  const [session, setSession] = useState<SessionModel | null>(null);

  // --- EXERCISES ---
  const [exercises, setExercises] = useState<
    SessionExerciseWithExerciseModel[]
  >([]);
  const [selectDeleteExercise, setSelectDeleteExercise] =
    useState<SessionExerciseWithExerciseModel | null>(null);

  // Liste d'exercices
  const listExercise: SessionExerciseWithExerciseModel[] = exercises.filter(
    (exercice: SessionExerciseWithExerciseModel) => {
      if (exoMode === 'IN_PROGRESS') return exercice.status !== 'DONE';
      else return true;
    }
  );
  const completedExercises: SessionExerciseWithExerciseModel[] =
    exercises.filter((exercise: SessionExerciseWithExerciseModel) => {
      return exercise.status === 'DONE';
    });

  // --- TEXTE ---
  const titleSession: string =
    session !== null
      ? `Séance du ${formatDateLong(new Date(session.date))} à ${formatTime(new Date(session.date))}`
      : '';
  const namePatient: string =
    patient !== null ? `${patient.firstName} ${patient.lastName}` : '';

  // --- DIALOG ---

  // Gestion de l'ouverture du dialogue de création/édition de séance
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);

  // Gestion de l'ouverture du dialogue sur l'alert de suppression d'une séance
  const [isAlertSession, setIsAlertSession] = useState(false);

  // Gestion de l'ouverture du dialogue sur l'alert de suppression d'un exercice
  const [isAlertExercise, setIsAlertExercise] = useState(false);

  const [isAddExerciseDialogOpen, setIsAddExerciseDialogOpen] = useState(false);
  const [allExercises, setAllExercises] = useState<
    ExerciseWithInterestsModel[]
  >([]);
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState('');

  // --- PREVIEW ---
  const [previewExercise, setPreviewExercise] = useState<ExerciseModel | null>(
    null
  );

  // --- ACTIVE EXERCISE (v2) ---
  const [activeRunningExercise, setActiveRunningExercise] =
    useState<ExerciseModel | null>(null);
  const [activeSessionExerciseId, setActiveSessionExerciseId] = useState<
    number | null
  >(null);

  const handleRunExercise = async (
    sessionExercise: SessionExerciseWithExerciseModel
  ) => {
    const targetExercise = sessionExercise.exercise;
    const index =
      exercises.findIndex((e) => e.exercise.id === targetExercise.id) + 1;
    const total = exercises.length;
    // Cast ExerciseModel to ExerciseWithInterestsModel — interests are not used by the session protocol
    await window.electronAPI.sessionServiceLoadExercise(
      targetExercise as ExerciseWithInterestsModel,
      index,
      total
    );
    setActiveRunningExercise(targetExercise);
    setActiveSessionExerciseId(sessionExercise.id);
  };

  const handleStopExercise = async () => {
    await window.electronAPI.sessionServiceEndSession();

    // Mark session exercise as DONE
    if (activeSessionExerciseId !== null) {
      const sessionExercise = exercises.find(
        (e) => e.id === activeSessionExerciseId
      );
      if (sessionExercise) {
        await window.electronAPI.sessionExerciseUpdateSessionExerciseStatus({
          id: sessionExercise.id,
          sessionId: sessionExercise.sessionId,
          exerciseId: sessionExercise.exerciseId,
          status: 'DONE',
        });
      }
    }

    setActiveRunningExercise(null);
    setActiveSessionExerciseId(null);

    // Refresh exercise list
    if (sessionId) {
      const refreshed = await fetchExercises(Number(sessionId));
      setExercises(refreshed);
    }
  };

  const handleOpenAddExercise = async () => {
    const all = await fetchAllExercises();
    setAllExercises(all);
    setExerciseSearchQuery('');
    setIsAddExerciseDialogOpen(true);
  };

  const handleAddExerciseToSession = async (
    exercise: ExerciseWithInterestsModel
  ) => {
    if (session === null) return;
    await window.electronAPI.sessionExerciseAddExerciseToSession({
      id: 0,
      sessionId: session.id,
      exerciseId: exercise.id,
      status: 'PENDING',
    });
    const refreshed = await fetchExercises(session.id);
    setExercises(refreshed);
    setIsAddExerciseDialogOpen(false);
  };

  // --- USEEFFECT ---
  // Récupération des données depuis la DB
  useEffect(() => {
    fetchPatient(Number(patientId)).then(
      (patient: PatientWithInterestsModel) => {
        setPatient(patient);
      }
    );
    fetchExercises(Number(sessionId)).then(
      (exercises: SessionExerciseWithExerciseModel[]) => {
        setExercises(exercises);
      }
    );
    fetchSession(Number(sessionId)).then((session: SessionModel) => {
      setSession(session);
    });
  }, [patientId, sessionId, exoMode]);

  const filteredExercises = allExercises.filter((ex) =>
    ex.name.toLowerCase().includes(exerciseSearchQuery.toLowerCase())
  );

  return (
    <div
      id={bindId.bindId(1, 'MainContainer')}
      className="h-full flex flex-col gap-5"
    >
      <div
        id={bindId.bindId(2, 'HeaderContainer')}
        className="flex justify-between items-center"
      >
        <div
          id={bindId.bindId(3, 'TitleContainer')}
          className="flex flex-col gap-3"
        >
          <h1 id={bindId.bindId(4, 'Title')} className="text-2xl font-bold">
            {titleSession}
          </h1>
          <p id={bindId.bindId(4, 'Text')} className="text-xl font-bold">
            {namePatient}
          </p>
        </div>

        {exoMode === 'IN_PROGRESS' ? (
          <Button
            id={bindId.bindId(3, 'Button')}
            onClick={() => {
              void (async () => {
                if (patient !== null && session !== null) {
                  await handleUpdateSession({
                    id: session.id,
                    createdAt: session.createdAt,
                    date: session.date,
                    notes: session.notes,
                    patientId: session.patientId,
                    status: 'COMPLETED',
                  } as SessionModel);
                  const patientPath: string | null = RoutesManager.navigateTo(
                    'patient',
                    String(patient.id)
                  );
                  if (patientPath !== null) navigate(patientPath);
                }
              })();
            }}
          >
            Terminer la séance
          </Button>
        ) : undefined}
        {exoMode === 'EDIT' ? (
          <div className="flex gap-2 justify-center items-center">
            <BtnIconPatient
              id={bindId.bindId(4, 'BtnEdit')}
              onClick={() => setIsSessionDialogOpen(true)}
              label={'Éditer'}
              icon={<Pencil className="w-5 h-5" />}
            />
            <BtnIconPatient
              id={bindId.bindId(4, 'BtnDelete')}
              onClick={() => {
                if (session !== null) {
                  setIsAlertSession(true);
                }
              }}
              label={'Supprimer'}
              icon={<Trash2Icon className="w-5 h-5" />}
            />
          </div>
        ) : undefined}
      </div>

      {session !== null && session.notes !== '' ? (
        <DataCard className="flex flex-wrap gap-6 p-5">
          <InfoItemPatient id="" label="Notes" value={session.notes} />
        </DataCard>
      ) : undefined}

      <DataCard className="flex flex-wrap gap-6 p-5">
        {exoMode === 'EDIT' || exoMode === 'IN_PROGRESS' ? (
          <AddCardExercise
            id={bindId.bindId(2, 'ButtonAdd')}
            onClick={handleOpenAddExercise}
          />
        ) : undefined}

        {listExercise.map((exercice: SessionExerciseWithExerciseModel) =>
          displayCard(
            bindId.bindId(2, 'Card'),
            exercice,
            exoMode,
            () => setPreviewExercise(exercice.exercise),
            () => handleRunExercise(exercice),
            () => {},
            () => {
              setSelectDeleteExercise(exercice);
              setIsAlertExercise(true);
            }
          )
        )}
        {listExercise.length === 0 ? (
          <p className="text-base">Aucun exercice à lancer</p>
        ) : undefined}
      </DataCard>

      {exoMode == 'IN_PROGRESS' ? (
        <DataCard className="flex flex-col gap-5 p-5">
          <h3 className="text-xl font-bold">Exercices terminées</h3>
          {completedExercises.length !== 0 ? (
            <div className="flex flex-wrap gap-6">
              {completedExercises.map(
                (exercice: SessionExerciseWithExerciseModel) =>
                  displayCard(
                    bindId.bindId(2, 'Card'),
                    exercice,
                    exoMode,
                    () => setPreviewExercise(exercice.exercise),
                    () => handleRunExercise(exercice),
                    () => {},
                    () => {
                      setSelectDeleteExercise(exercice);
                      setIsAlertExercise(true);
                    }
                  )
              )}
            </div>
          ) : (
            <p className="text-base">Aucun exercice terminé</p>
          )}
        </DataCard>
      ) : undefined}

      {/* Dialogues de création ou de modification */}
      <SessionDialog
        id=""
        isOpen={isSessionDialogOpen}
        onClose={() => setIsSessionDialogOpen(false)}
        onSave={async (newSession) => {
          if (session != null && patient !== null) {
            const saveSession: SessionModel = await handleUpdateSession({
              id: session.id,
              createdAt: session.createdAt,
              date: newSession.date,
              notes: newSession.notes,
              patientId: patient.id,
              status: session.status,
            } as SessionModel);
            setSession(saveSession);
            setIsSessionDialogOpen(false);
          }
        }}
        initialSession={session}
      />

      {/* Dialogue d'alerte */}
      <SessionDeleteAlert
        id=""
        isOpen={isAlertSession}
        onClose={() => setIsAlertSession(false)}
        onDelete={async (session: SessionModel | null) => {
          if (patient !== null && session !== null) {
            await handleDeleteSession(navigate, patient, session);
            await refreshActiveSession();
            setIsAlertSession(false);
          }
        }}
        deleteSession={session}
      />
      <ExerciseDeleteAlert
        id=""
        isOpen={isAlertExercise}
        onClose={() => setIsAlertExercise(false)}
        onDelete={async (exercice: SessionExerciseWithExerciseModel | null) => {
          if (session !== null && exercice !== null) {
            const exercises: SessionExerciseWithExerciseModel[] =
              await handleDeleteExercise(session, exercice);
            setExercises(exercises);
            setIsAlertExercise(false);
          }
        }}
        deleteExercise={selectDeleteExercise}
      />

      {/* v2: Active Exercise Panel */}
      {activeRunningExercise && (
        <ActiveExercisePanel
          exercise={activeRunningExercise}
          onStop={handleStopExercise}
        />
      )}

      {/* Dialog d'ajout d'exercice */}
      <Dialog
        open={isAddExerciseDialogOpen}
        onOpenChange={setIsAddExerciseDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Ajouter un exercice</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Rechercher un exercice..."
            value={exerciseSearchQuery}
            onChange={(e) => setExerciseSearchQuery(e.target.value)}
            className="mt-2"
          />
          <div className="flex-1 overflow-y-auto mt-3 flex flex-col gap-2">
            <>
              {filteredExercises.map((ex) => {
                const alreadyAdded = exercises.some(
                  (se) => se.exerciseId === ex.id
                );
                return (
                  <button
                    key={ex.id}
                    disabled={alreadyAdded}
                    onClick={() => handleAddExerciseToSession(ex)}
                    className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                      alreadyAdded
                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
                        : 'hover:bg-blue-50 hover:border-blue-300 border-gray-200'
                    }`}
                  >
                    <span className="font-medium">{ex.name}</span>
                    <span className="ml-2 text-xs text-gray-500 uppercase">
                      {ex.model}
                    </span>
                    {alreadyAdded && (
                      <span className="ml-2 text-xs text-gray-400">
                        (déjà ajouté)
                      </span>
                    )}
                  </button>
                );
              })}
              {filteredExercises.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Aucun exercice trouvé
                </p>
              )}
            </>
          </div>
          <DialogFooter className="mt-3">
            <Button
              variant="outline"
              onClick={() => setIsAddExerciseDialogOpen(false)}
            >
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de prévisualisation d'exercice */}
      <Dialog
        open={previewExercise !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewExercise(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{previewExercise?.name}</DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-wide text-gray-500">
              {previewExercise?.model}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto mt-2">
            {previewExercise?.model === 'SFA' ? (
              <div className="flex flex-col gap-3">
                {SFA_FIELDS.map((field) => {
                  const raw = (previewExercise.data as SFAExerciseModel)?.[
                    field.key
                  ];
                  const items = raw
                    ? String(raw)
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                    : [];
                  if (items.length === 0) return null;
                  return (
                    <div key={field.key}>
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-0.5 rounded mb-1 ${field.color}`}
                      >
                        {field.label}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {items.map((item, i) => (
                          <span
                            key={i}
                            className="text-sm bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-4">
                Pas d&apos;aperçu disponible pour ce type d&apos;exercice (
                {previewExercise?.model}).
              </p>
            )}
          </div>
          <DialogFooter className="mt-3">
            <Button variant="outline" onClick={() => setPreviewExercise(null)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
