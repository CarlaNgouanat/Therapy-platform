import { IpcDBType } from '@electron/utils/data/IpcDBPreload';

// --- DB ---

const ipcDBChannels: (keyof IpcDBType)[] = [
  // ExerciseDB
  'exerciseGetAllExercisesWithInterests',
  'exerciseGetExerciseWithInterestsById',
  'exerciseGetById',
  'exerciseCreateExercise',
  'exerciseUpdateExercice',
  'exerciseDeleteById',

  // InterestDB
  'interestGetAllInterests',
  'interestCreateInterest',
  'interestUpdateInterest',
  'interestDeleteInterest',
  'interestGetByPatientId',
  'interestGetByExerciseId',
  'interestSetForPatient',
  'interestSetForExercise',

  // PatientDB
  'patientGetAllPatientsWithInterests',
  'patientGetPatientWithInterestsById',
  'patientCreatePatient',
  'patientUpdatePatient',
  'patientDeleteById',

  // ResourceDB
  'resourceGetByType',
  'resourceCreateResource',
  'resourceDeleteResource',

  // SessionDB
  'sessionIsActivePatient',
  'sessionGetActivePatient',
  'sessionGetByPatient',
  'sessionGetById',
  'sessionStartSession',
  'sessionCreateSession',
  'sessionUpdateSession',
  'sessionUpdateSessionStatus',
  'sessionDeleteById',

  // SessionExerciseDB
  'sessionExerciseGgetBySession',
  'sessionExerciseGetExercisesForSession',
  'sessionExerciseAddExerciseToSession',
  'sessionExerciseUpdateSessionExerciseStatus',
  'sessionExerciseDeleteById',
];
export default ipcDBChannels;
