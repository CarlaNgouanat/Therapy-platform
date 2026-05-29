import { ExerciseDB } from '@database/db/ExerciseDB';
import { InterestDB } from '@database/db/InterestDB';
import { PatientDB } from '@database/db/PatientDB';
import { ResourceDB } from '@database/db/ResourceDB';
import { SessionDB } from '@database/db/SessionDB';
import { SessionExerciseDB } from '@database/db/SessionExerciseDB';
import { IpcDBType } from '@electron/utils/data/IpcDBPreload';

// --- DB ---

const exerciseDB: ExerciseDB = new ExerciseDB();
const interestDB: InterestDB = new InterestDB();
const patientDB: PatientDB = new PatientDB();
const resourceDB: ResourceDB = new ResourceDB();
const sessionDB: SessionDB = new SessionDB();
const sessionExerciseDB: SessionExerciseDB = new SessionExerciseDB();

// Tableau associatif key - function
const ipcDB = <IpcDBType>{
  // ExerciseDB
  exerciseGetAllExercisesWithInterests:
    exerciseDB.getAllExercisesWithInterests.bind(exerciseDB),
  exerciseGetExerciseWithInterestsById:
    exerciseDB.getExerciseWithInterestsById.bind(exerciseDB),
  exerciseGetById: exerciseDB.getById.bind(exerciseDB),
  exerciseCreateExercise: exerciseDB.createExercise.bind(exerciseDB),
  exerciseUpdateExercice: exerciseDB.updateExercice.bind(exerciseDB),
  exerciseDeleteById: exerciseDB.deleteById.bind(exerciseDB),

  // ExerciseInterestDB - EMPTY

  // InterestDB
  interestGetAllInterests: interestDB.getAllInterests.bind(interestDB),
  interestCreateInterest: interestDB.createInterest.bind(interestDB),
  interestUpdateInterest: interestDB.updateInterest.bind(interestDB),
  interestDeleteInterest: interestDB.deleteInterest.bind(interestDB),
  interestGetByPatientId: interestDB.getByPatientId.bind(interestDB),
  interestGetByExerciseId: interestDB.getByExerciseId.bind(interestDB),
  interestSetForPatient: interestDB.setForPatient.bind(interestDB),
  interestSetForExercise: interestDB.setForExercise.bind(interestDB),

  // PatientDB
  patientGetAllPatientsWithInterests:
    patientDB.getAllPatientsWithInterests.bind(patientDB),
  patientGetPatientWithInterestsById:
    patientDB.getPatientWithInterestsById.bind(patientDB),
  patientCreatePatient: patientDB.createPatient.bind(patientDB),
  patientUpdatePatient: patientDB.updatePatient.bind(patientDB),
  patientDeleteById: patientDB.deleteById.bind(patientDB),

  // PatientInterestDB - EMPTY

  // ResourceDB
  resourceGetByType: resourceDB.getByType.bind(resourceDB),
  resourceCreateResource: resourceDB.createResource.bind(resourceDB),
  resourceDeleteResource: resourceDB.deleteResource.bind(resourceDB),

  // SessionDB
  sessionIsActivePatient: sessionDB.isActivePatient.bind(sessionDB),
  sessionGetActivePatient: sessionDB.getActivePatient.bind(sessionDB),
  sessionGetByPatient: sessionDB.getByPatient.bind(sessionDB),
  sessionGetById: sessionDB.getById.bind(sessionDB),
  sessionStartSession: sessionDB.startSession.bind(sessionDB),
  sessionCreateSession: sessionDB.createSession.bind(sessionDB),
  sessionUpdateSession: sessionDB.updateSession.bind(sessionDB),
  sessionUpdateSessionStatus: sessionDB.updateSessionStatus.bind(sessionDB),
  sessionDeleteById: sessionDB.deleteById.bind(sessionDB),

  // SessionExerciseDB
  sessionExerciseGgetBySession:
    sessionExerciseDB.getBySession.bind(sessionExerciseDB),
  sessionExerciseGetExercisesForSession:
    sessionExerciseDB.getExercisesForSession.bind(sessionExerciseDB),
  sessionExerciseAddExerciseToSession:
    sessionExerciseDB.addExerciseToSession.bind(sessionExerciseDB),
  sessionExerciseUpdateSessionExerciseStatus:
    sessionExerciseDB.updateSessionExerciseStatus.bind(sessionExerciseDB),
  sessionExerciseDeleteById:
    sessionExerciseDB.deleteById.bind(sessionExerciseDB),
};

export default ipcDB;
