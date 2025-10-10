import { Provider } from '@angular/core';
import { NEOLINE_DEBUG_LOGS } from './neoline.service';

export function provideNeolineDebug(enabled: boolean): Provider {
  return { provide: NEOLINE_DEBUG_LOGS, useValue: enabled };
}
