import { DBRequestIdModel } from '@shared/models/DBRequestIdModel';
import { DBRequestNameModel } from '@shared/models/DBRequestNameModel';
import { DBRequestResourceTypeModel } from '@shared/models/DBRequestResourceTypeModel';
import { DBResponseCreateModel } from '@shared/models/DBResponseCreateModel';
import { DBResponseDeleteModel } from '@shared/models/DBResponseDeleteModel';
import { DBResponseUpdateModel } from '@shared/models/DBResponseUpdateModel';
import { ExerciseModel } from '@shared/models/ExerciseModel';
import { ExerciseWithInterestsModel } from '@shared/models/ExerciseWithInterestsModel';
import { InterestModel } from '@shared/models/InterestModel';
import { PatientWithInterestsModel } from '@shared/models/PatientWithInterestsModel';
import { ResourceModel } from '@shared/models/ResourceModel';
import { ActiveSessionPatientModel } from '@shared/models/ActiveSessionPatientModel';
import { SessionExerciseModel } from '@shared/models/SessionExerciseModel';
import { SessionExerciseWithExerciseModel } from '@shared/models/SessionExerciseWithExerciseModel';
import { SessionModel } from '@shared/models/SessionModel';
import { SessionWithExerciseCountModel } from '@shared/models/SessionWithExerciseCountModel';
import { IsActiveSessionModel } from '@shared/models/IsActiveSessionModel';

// --- DATABASE ---

export type IpcDBType = {
  // ExerciseDB
  exerciseGetAllExercisesWithInterests: () => ExerciseWithInterestsModel[];
  exerciseGetExerciseWithInterestsById: (
    modelId: DBRequestIdModel
  ) => ExerciseWithInterestsModel;
  exerciseGetById: (modelId: DBRequestIdModel) => ExerciseModel;
  exerciseCreateExercise: (
    exerciseWithInterests: ExerciseWithInterestsModel
  ) => DBResponseCreateModel;
  exerciseUpdateExercice: (
    exerciseWithInterests: ExerciseWithInterestsModel
  ) => DBResponseUpdateModel;
  exerciseDeleteById: (modelId: DBRequestIdModel) => DBResponseDeleteModel;

  // ExerciseInterestDB - EMPTY

  // InterestDB
  interestGetAllInterests: () => InterestModel[];
  interestCreateInterest: (
    modelName: DBRequestNameModel
  ) => DBResponseCreateModel;
  interestUpdateInterest: (interest: InterestModel) => DBResponseUpdateModel;
  interestDeleteInterest: (modelId: DBRequestIdModel) => DBResponseDeleteModel;
  interestGetByPatientId: (modelId: DBRequestIdModel) => InterestModel[];
  interestGetByExerciseId: (modelId: DBRequestIdModel) => InterestModel[];
  interestSetForPatient: (
    patient: PatientWithInterestsModel
  ) => DBResponseUpdateModel;
  interestSetForExercise: (
    exercise: ExerciseWithInterestsModel
  ) => DBResponseUpdateModel;

  // PatientDB
  patientGetAllPatientsWithInterests: () => PatientWithInterestsModel[];
  patientGetPatientWithInterestsById: (
    modelId: DBRequestIdModel
  ) => PatientWithInterestsModel;
  patientCreatePatient: (
    patientWithInterests: PatientWithInterestsModel
  ) => DBResponseCreateModel;
  patientUpdatePatient: (
    patientWithInterests: PatientWithInterestsModel
  ) => DBResponseUpdateModel;
  patientDeleteById: (modelId: DBRequestIdModel) => DBResponseDeleteModel;

  // PatientInterestDB - EMPTY

  // ResourceDB
  resourceGetByType: (modelType: DBRequestResourceTypeModel) => ResourceModel[];
  resourceCreateResource: (resource: ResourceModel) => DBResponseCreateModel;
  resourceDeleteResource: (modelId: DBRequestIdModel) => DBResponseDeleteModel;

  // SessionDB
  sessionIsActivePatient: () => IsActiveSessionModel;
  sessionGetActivePatient: () => ActiveSessionPatientModel;
  sessionGetByPatient: (
    modelId: DBRequestIdModel
  ) => SessionWithExerciseCountModel[];
  sessionGetById: (modelId: DBRequestIdModel) => SessionModel;
  sessionStartSession: (session: SessionModel) => DBResponseUpdateModel;
  sessionCreateSession: (session: SessionModel) => DBResponseCreateModel;
  sessionUpdateSession: (sessionModel: SessionModel) => DBResponseUpdateModel;
  sessionUpdateSessionStatus: (
    sessionModel: SessionModel
  ) => DBResponseUpdateModel;
  sessionDeleteById: (modelId: DBRequestIdModel) => DBResponseDeleteModel;

  // SessionExerciseDB
  sessionExerciseGgetBySession: (
    modelId: DBRequestIdModel
  ) => SessionExerciseModel[];
  sessionExerciseGetExercisesForSession: (
    modelId: DBRequestIdModel
  ) => SessionExerciseWithExerciseModel[];
  sessionExerciseAddExerciseToSession: (
    sessionExercise: SessionExerciseModel
  ) => DBResponseCreateModel;
  sessionExerciseUpdateSessionExerciseStatus: (
    sessionExercise: SessionExerciseModel
  ) => DBResponseUpdateModel;
  sessionExerciseDeleteById: (
    modelId: DBRequestIdModel
  ) => DBResponseDeleteModel;
};

export type IpcDBPromiseType = {
  [key in keyof IpcDBType]: (
    ...params: Parameters<IpcDBType[key]>
  ) => Promise<ReturnType<IpcDBType[key]>>;
};
