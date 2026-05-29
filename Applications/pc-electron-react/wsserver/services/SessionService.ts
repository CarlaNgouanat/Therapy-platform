import { WSServer } from '@wsserver/server/WSServer';
import { AbstractService } from '@wsserver/services/AbstractService';
import { ExerciseWithInterestsModel } from '@shared/models/ExerciseWithInterestsModel';
import { SFAExerciseModel } from '@shared/models/exercises/SFAExerciseModel';
import { SFAFieldType } from '@shared/types/SFAFieldType';
import {
  SessionStatePayload,
  FieldData,
  createSessionStateMessage,
  createSessionEndMessage,
} from '@shared/types/WSMessage';
import { LogsManager } from '@shared/utils/LogsManager';

/**
 * SessionService v2 — State Machine (Singleton)
 *
 * Holds the full SessionStatePayload as single source of truth.
 * Every mutation pushes the updated state to the tablet.
 */
export class SessionService extends AbstractService {
  // --- STATE ---

  private sessionState: SessionStatePayload | null = null;
  private ackTimer: NodeJS.Timeout | null = null;
  private lastPushedMessageId: string | null = null;

  private onAckTimeoutCallback: (() => void) | null = null;
  private onAckReceivedCallback: (() => void) | null = null;

  private static instance: SessionService | null = null;

  // --- SINGLETON ---

  private constructor() {
    super();
    this.registerWSHandlers();
  }

  public static getInstance(): SessionService {
    if (SessionService.instance === null) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  // --- INITIALIZATION ---

  private registerWSHandlers(): void {
    const wsServer = WSServer.getInstance();

    // Re-push state when tablet reconnects
    wsServer.onTabletConnected(() => {
      if (this.sessionState) {
        LogsManager.logInfo("Tablette reconnectée, renvoi de l'état");
        this.pushStateToTablet();
      }
    });

    // Listen for ACKs
    wsServer.onAck((ackId: string) => {
      if (ackId === this.lastPushedMessageId) {
        if (this.ackTimer) {
          clearTimeout(this.ackTimer);
          this.ackTimer = null;
        }
        this.onAckReceivedCallback?.();
      }
    });
  }

  // --- CONFIGURATION ---

  public setOnAckTimeout(callback: () => void): void {
    this.onAckTimeoutCallback = callback;
  }

  public setOnAckReceived(callback: () => void): void {
    this.onAckReceivedCallback = callback;
  }

  // --- STATE PUSH ---

  private pushStateToTablet(): void {
    if (!this.sessionState) return;

    const message = createSessionStateMessage(this.sessionState);
    this.lastPushedMessageId = message.id;

    const wsServer = WSServer.getInstance();
    const sent = wsServer.sendToTablet(message);

    if (sent) {
      if (this.ackTimer) clearTimeout(this.ackTimer);
      this.ackTimer = setTimeout(() => {
        LogsManager.logWarning(
          "ACK timeout — la tablette n'a peut-être pas reçu l'état"
        );
        this.onAckTimeoutCallback?.();
        this.ackTimer = null;
      }, 3000);
    }
  }

  // --- HELPERS ---

  private parseSfaField(raw?: string): string[] {
    if (!raw) return [];
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  private buildFields(
    exercise: ExerciseWithInterestsModel
  ): Record<SFAFieldType, FieldData> {
    const data = exercise.data as SFAExerciseModel;
    const hasSfa = data?.sfaAction !== undefined;

    return {
      CATEGORY: {
        label: 'Catégorie',
        subtitle: "C'est un ...",
        values: hasSfa ? this.parseSfaField(data.sfaCategory) : [],
      },
      USE: {
        label: 'Usage',
        subtitle: 'Sert à ...',
        values: hasSfa ? this.parseSfaField(data.sfaUse) : [],
      },
      ACTION: {
        label: 'Action',
        subtitle: 'Fait quoi ?',
        values: hasSfa ? this.parseSfaField(data.sfaAction) : [],
      },
      PROPERTIES: {
        label: 'Propriétés',
        subtitle: "C'est en ...",
        values: hasSfa ? this.parseSfaField(data.sfaProperties) : [],
      },
      ASSOCIATION: {
        label: 'Association',
        subtitle: 'Me fait penser à ?',
        values: hasSfa ? this.parseSfaField(data.sfaAssociation) : [],
      },
    };
  }

  private emptyGivenAnswers(): Record<SFAFieldType, string[]> {
    return {
      CATEGORY: [],
      USE: [],
      ACTION: [],
      PROPERTIES: [],
      ASSOCIATION: [],
    };
  }

  // --- MUTATIONS (each pushes state to tablet) ---

  public loadExercise(
    exercise: ExerciseWithInterestsModel,
    index: number,
    total: number
  ): boolean {
    LogsManager.logInfo(
      `Chargement exercice: ${exercise.name} (${index}/${total})`
    );

    this.sessionState = {
      exercise: {
        id: exercise.id,
        name: exercise.name,
        model: exercise.model,
        image_url: null,
        index,
        total,
      },
      fields: this.buildFields(exercise),
      activeField: null,
      validation: null,
      givenAnswers: this.emptyGivenAnswers(),
    };

    this.pushStateToTablet();
    return true;
  }

  public selectField(fieldType: SFAFieldType): void {
    if (!this.sessionState) return;
    this.sessionState.activeField = fieldType;
    this.sessionState.validation = null;
    this.pushStateToTablet();
  }

  public deselectField(): void {
    if (!this.sessionState) return;
    this.sessionState.activeField = null;
    this.sessionState.validation = null;
    this.pushStateToTablet();
  }

  public sendValidation(fieldType: SFAFieldType, isCorrect: boolean): void {
    if (!this.sessionState) return;

    const field = this.sessionState.fields[fieldType];
    const expectedValue = field ? field.values.join(', ') : null;

    this.sessionState.validation = {
      fieldType,
      isCorrect,
      expectedValue: isCorrect ? null : expectedValue,
    };

    this.pushStateToTablet();
  }

  public markAnswerGiven(fieldType: SFAFieldType, value: string): void {
    if (!this.sessionState) return;

    const given = this.sessionState.givenAnswers[fieldType];
    if (!given.some((g) => g.toLowerCase() === value.toLowerCase())) {
      given.push(value);
    }

    this.pushStateToTablet();
  }

  public endSession(): void {
    const wsServer = WSServer.getInstance();
    const message = createSessionEndMessage();
    wsServer.sendToTablet(message);

    this.sessionState = null;
    this.lastPushedMessageId = null;
    if (this.ackTimer) {
      clearTimeout(this.ackTimer);
      this.ackTimer = null;
    }
  }

  // --- QUERIES ---

  public getTabletStatus(): { connected: boolean } {
    const wsServer = WSServer.getInstance();
    return { connected: wsServer.isTabletConnected() };
  }

  public getConnectedClientsCount(): number {
    const wsServer = WSServer.getInstance();
    return wsServer.getConnectedClientsCount();
  }
}
