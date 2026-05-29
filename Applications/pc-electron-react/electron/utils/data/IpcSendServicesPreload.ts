import { ExerciseWithInterestsModel } from '@shared/models/ExerciseWithInterestsModel';
import { SFAFieldType } from '@shared/types/SFAFieldType';

// --- SERVICES ---

export type IpcSendServicesType = {
  // SessionService v2
  sessionServiceLoadExercise: (
    exercise: ExerciseWithInterestsModel,
    index: number,
    total: number
  ) => boolean;
  sessionServiceSelectField: (fieldType: SFAFieldType) => void;
  sessionServiceDeselectField: () => void;
  sessionServiceSendValidation: (
    fieldType: SFAFieldType,
    isCorrect: boolean
  ) => void;
  sessionServiceMarkAnswerGiven: (
    fieldType: SFAFieldType,
    value: string
  ) => void;
  sessionServiceEndSession: () => void;
  sessionServiceGetTabletStatus: () => { connected: boolean };
  sessionServiceGetConnectedClientsCount: () => number;
};

export type IpcSendServicesPromiseType = {
  [key in keyof IpcSendServicesType]: (
    ...params: Parameters<IpcSendServicesType[key]>
  ) => Promise<ReturnType<IpcSendServicesType[key]>>;
};
