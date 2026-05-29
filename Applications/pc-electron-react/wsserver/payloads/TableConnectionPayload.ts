import { AbstractPayload } from '@wsserver/payloads/AbstractPayload';

/**
 * Payload regroupant sur la connexion de la tablette sur le réseau
 */
export interface TabletConnectionPayload extends AbstractPayload {
  device_id?: string;
  device_name?: string;
}
