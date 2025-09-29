import type { NeolineN3Constructor } from './neoline.types';

declare global {
  interface Window {
    // NEOLine N2 (left intentionally loose for now)
    NEOLine?: { Init: new () => unknown };
    // NEOLine N3 typed constructor
    NEOLineN3?: NeolineN3Constructor;
  }
}

export {};
