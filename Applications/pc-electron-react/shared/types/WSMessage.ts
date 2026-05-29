/**
 * WebSocket Message Protocol v2
 * Command-based: PC pushes state snapshots, Tablet renders and ACKs.
 */

import { v4 as uuidv4 } from 'uuid';
import { SFAFieldType } from '@shared/types/SFAFieldType';
import { ExerciseType } from '@shared/types/ExerciseType';

// --- Payload Types ---

export interface FieldData {
  label: string;
  subtitle: string;
  values: string[];
}

export interface ExerciseData {
  id: number;
  name: string;
  model: ExerciseType;
  image_url: string | null;
  index: number; // 1-based position in session
  total: number; // total exercises in session
}

export interface ValidationData {
  fieldType: SFAFieldType;
  isCorrect: boolean;
  expectedValue: string | null;
}

export interface SessionStatePayload {
  exercise: ExerciseData;
  fields: Record<SFAFieldType, FieldData>;
  activeField: SFAFieldType | null;
  validation: ValidationData | null;
  givenAnswers: Record<SFAFieldType, string[]>;
}

export interface TabletConnectionPayload {
  device_id: string;
  device_name: string;
}

export interface AckPayload {
  ack_id: string;
}

// --- Main Message Type ---

export interface WSMessage<T = unknown> {
  id: string;
  event: string;
  payload: T;
  timestamp: string;
}

// --- Typed Message Aliases ---

export type SessionStateMessage = WSMessage<SessionStatePayload>;
export type SessionEndMessage = WSMessage<Record<string, never>>;
export type TabletConnectedMessage = WSMessage<TabletConnectionPayload>;
export type AckMessage = WSMessage<AckPayload>;

// --- Factory Functions ---

export function createSessionStateMessage(
  payload: SessionStatePayload
): SessionStateMessage {
  return {
    id: uuidv4(),
    event: 'SESSION_STATE',
    payload,
    timestamp: new Date().toISOString(),
  };
}

export function createSessionEndMessage(): SessionEndMessage {
  return {
    id: uuidv4(),
    event: 'SESSION_END',
    payload: {},
    timestamp: new Date().toISOString(),
  };
}

// --- Parsing ---

export function parseWSMessage(raw: string): WSMessage | null {
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.event === 'string' &&
      parsed.payload !== undefined &&
      typeof parsed.id === 'string'
    ) {
      return parsed as WSMessage;
    }
    return null;
  } catch {
    return null;
  }
}

export function serializeWSMessage(message: WSMessage): string {
  return JSON.stringify(message);
}
