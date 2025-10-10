import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, ReplaySubject, firstValueFrom } from 'rxjs';
import type {
  GetNetworksResponse,
  GetAccountResponse,
  GetPublicKeyResponse,
  GetProviderResponse,
  GetStorageParams,
  GetStorageResponse,
  GetBalanceResponse,
  InvokeReadParams,
  InvokeReadResponse,
  InvokeReadMultiParams,
  InvokeReadMultiResponse,
  VerifyMessageV2Params,
  VerifyMessageV2Response,
  GetBlockParams,
  GetBlockResponse,
  GetTransactionParams,
  GetTransactionResponse,
  GetApplicationLogParams,
  GetApplicationLogResponse,
  PickAddressResponse,
  AddressToScriptHashParams,
  AddressToScriptHashResponse,
  ScriptHashToAddressParams,
  ScriptHashToAddressResponse,
  SendParams,
  SendResponse,
  InvokeParams,
  InvokeResponse,
  InvokeMultipleParams,
  NeolineN3Provider,
  CommonEventName,
  CommonEventPayloadMap,
  SignMessageV2Params,
  SignMessageV2Response,
  SignMessageWithoutSaltV2Params,
  SignMessageWithoutSaltV2Response,
  SignTransactionParams,
  SignTransactionResponse,
  SwitchWalletNetworkParams,
} from './neoline.types';
import type {} from './global';

const NEO_READY_EVENT = 'NEOLine.NEO.EVENT.READY';
const N3_READY_EVENT = 'NEOLine.N3.EVENT.READY';

export const NEOLINE_DEBUG_LOGS = new InjectionToken<boolean>(
  'NEOLINE_DEBUG_LOGS',
  { providedIn: 'root', factory: () => false }
);

@Injectable({ providedIn: 'root' })
export class NeolineService {
  private readonly neoSubject = new ReplaySubject<unknown>(1);
  private readonly n3Subject = new ReplaySubject<NeolineN3Provider>(1);
  private readonly debugEnabled = inject(NEOLINE_DEBUG_LOGS);

  private debug(method: string, ...args: unknown[]): void {
    if (this.debugEnabled) {
      console.debug('[NeolineService]', method, ...args);
    }
  }

  private logError(method: string, err: unknown): void {
    console.error('[NeolineService]', method, err);
  }

  private async call<T>(
    method: string,
    args: unknown[],
    fn: (n3: NeolineN3Provider) => Promise<T>
  ): Promise<T> {
    this.debug(`${method}:start`, ...args);
    try {
      const n3 = await this.getNeolineN3();
      const result = await fn(n3);
      this.debug(`${method}:success`, result);
      return result;
    } catch (err) {
      this.logError(`${method}:fail`, err);
      throw err;
    }
  }

  constructor() {
    this.initializeEventListeners();
  }

  get neoline$(): Observable<unknown> {
    return this.neoSubject.asObservable();
  }

  get neolineN3$(): Observable<NeolineN3Provider> {
    return this.n3Subject.asObservable();
  }

  async getNeoline(): Promise<unknown> {
    this.debug('getNeoline:start');
    try {
      const instance = await firstValueFrom(this.neoline$);
      this.debug('getNeoline:success');
      return instance;
    } catch (err) {
      this.logError('getNeoline:fail', err);
      throw err;
    }
  }

  async getNeolineN3(): Promise<NeolineN3Provider> {
    this.debug('getNeolineN3:start');
    try {
      const instance = await firstValueFrom(this.neolineN3$);
      this.debug('getNeolineN3:success');
      return instance;
    } catch (err) {
      this.logError('getNeolineN3:fail', err);
      throw err;
    }
  }

  async getNetworks(): Promise<GetNetworksResponse> {
    return this.call('getNetworks', [], (n3) => n3.getNetworks());
  }

  async getAccount(): Promise<GetAccountResponse> {
    return this.call('getAccount', [], (n3) => n3.getAccount());
  }

  async getPublicKey(): Promise<GetPublicKeyResponse> {
    return this.call('getPublicKey', [], (n3) => n3.getPublicKey());
  }

  async getProvider(): Promise<GetProviderResponse> {
    return this.call('getProvider', [], (n3) => n3.getProvider());
  }

  async getStorage(params: GetStorageParams): Promise<GetStorageResponse> {
    return this.call('getStorage', [params], (n3) => n3.getStorage(params));
  }

  async getBalance(): Promise<GetBalanceResponse> {
    return this.call('getBalance', [], (n3) => n3.getBalance());
  }

  async invokeRead(params: InvokeReadParams): Promise<InvokeReadResponse> {
    return this.call('invokeRead', [params], (n3) => n3.invokeRead(params));
  }

  async invokeReadMulti(
    params: InvokeReadMultiParams
  ): Promise<InvokeReadMultiResponse> {
    return this.call('invokeReadMulti', [params], (n3) =>
      n3.invokeReadMulti(params)
    );
  }

  async verifyMessageV2(
    params: VerifyMessageV2Params
  ): Promise<VerifyMessageV2Response> {
    return this.call('verifyMessageV2', [params], (n3) =>
      n3.verifyMessageV2(params)
    );
  }

  async getBlock(params: GetBlockParams): Promise<GetBlockResponse> {
    return this.call('getBlock', [params], (n3) => n3.getBlock(params));
  }

  async getTransaction(
    params: GetTransactionParams
  ): Promise<GetTransactionResponse> {
    return this.call('getTransaction', [params], (n3) =>
      n3.getTransaction(params)
    );
  }

  async getApplicationLog(
    params: GetApplicationLogParams
  ): Promise<GetApplicationLogResponse> {
    return this.call('getApplicationLog', [params], (n3) =>
      n3.getApplicationLog(params)
    );
  }

  async pickAddress(): Promise<PickAddressResponse> {
    return this.call('pickAddress', [], (n3) => n3.pickAddress());
  }

  async addressToScriptHash(
    params: AddressToScriptHashParams
  ): Promise<AddressToScriptHashResponse> {
    return this.call('AddressToScriptHash', [params], (n3) =>
      n3.AddressToScriptHash(params)
    );
  }

  async scriptHashToAddress(
    params: ScriptHashToAddressParams
  ): Promise<ScriptHashToAddressResponse> {
    return this.call('ScriptHashToAddress', [params], (n3) =>
      n3.ScriptHashToAddress(params)
    );
  }

  async send(params: SendParams): Promise<SendResponse> {
    return this.call('send', [params], (n3) => n3.send(params));
  }

  async invoke(params: InvokeParams): Promise<InvokeResponse> {
    return this.call('invoke', [params], (n3) => n3.invoke(params));
  }

  async invokeMultiple(params: InvokeMultipleParams): Promise<InvokeResponse> {
    return this.call('invokeMultiple', [params], (n3) =>
      n3.invokeMultiple(params)
    );
  }

  async signMessageV2(
    params: SignMessageV2Params
  ): Promise<SignMessageV2Response> {
    return this.call('signMessageV2', [params], (n3) =>
      n3.signMessageV2(params)
    );
  }

  async signMessageWithoutSaltV2(
    params: SignMessageWithoutSaltV2Params
  ): Promise<SignMessageWithoutSaltV2Response> {
    return this.call('signMessageWithoutSaltV2', [params], (n3) =>
      n3.signMessageWithoutSaltV2(params)
    );
  }

  async signTransaction(
    params: SignTransactionParams
  ): Promise<SignTransactionResponse> {
    return this.call('signTransaction', [params], (n3) =>
      n3.signTransaction(params)
    );
  }

  async switchWalletNetwork(params: SwitchWalletNetworkParams): Promise<null> {
    return this.call('switchWalletNetwork', [params], (n3) =>
      n3.switchWalletNetwork(params)
    );
  }

  async switchWalletAccount(): Promise<null> {
    return this.call('switchWalletAccount', [], (n3) =>
      n3.switchWalletAccount()
    );
  }

  on<E extends CommonEventName>(
    event: E
  ): Observable<CommonEventPayloadMap[E]> {
    return new Observable<CommonEventPayloadMap[E]>((subscriber) => {
      this.debug('on:subscribe:start', String(event));
      let provider: NeolineN3Provider | undefined;
      const handler = (payload: CommonEventPayloadMap[E]) => {
        this.debug('on:event', String(event), payload);
        subscriber.next(payload);
      };

      this.getNeolineN3()
        .then((n3) => {
          provider = n3;
          this.debug('on:listener:added', String(event));
          n3.addEventListener(event, handler);
        })
        .catch((err) => {
          this.logError('on:subscribe:fail', err);
          subscriber.error(err);
        });

      return () => {
        this.debug('on:unsubscribe', String(event));
        if (provider) {
          try {
            provider.removeEventListener(event, handler);
            this.debug('on:listener:removed', String(event));
          } catch (err) {
            this.logError('on:unsubscribe:fail', err);
          }
        }
      };
    });
  }

  private initializeEventListeners(): void {
    if (typeof window === 'undefined') {
      this.debug('init:skipped:ssr');
      return;
    }

    // If the extension already injected the objects, initialize immediately
    try {
      const w = window as Window;
      if (w.NEOLine?.Init) {
        const instance = new w.NEOLine.Init();
        if (instance) {
          this.neoSubject.next(instance);
          this.debug('init:NEOLine:injected');
        } else {
          this.neoSubject.error(
            new Error('common dAPI method failed to load.')
          );
          this.logError(
            'init:NEOLine:injected:fail',
            new Error('common dAPI method failed to load.')
          );
        }
      }
      if (w.NEOLineN3?.Init) {
        const instanceN3 = new w.NEOLineN3.Init();
        if (instanceN3) {
          this.n3Subject.next(instanceN3);
          this.debug('init:NEOLineN3:injected');
        } else {
          this.n3Subject.error(new Error('N3 dAPI method failed to load.'));
          this.logError(
            'init:NEOLineN3:injected:fail',
            new Error('N3 dAPI method failed to load.')
          );
        }
      }
    } catch (err) {
      this.debug('init:injected-check:error', err);
      // Ignore and rely on events below
    }

    window.addEventListener(NEO_READY_EVENT, () => {
      try {
        const w = window as Window;
        if (!w.NEOLine?.Init) {
          this.neoSubject.error(
            new Error('NEOLine Init not available on READY event.')
          );
          this.logError(
            'NEO_READY_EVENT:Init:missing',
            new Error('NEOLine Init not available on READY event.')
          );
          return;
        }
        const neoline = new w.NEOLine.Init();
        if (neoline) {
          this.neoSubject.next(neoline);
          this.debug('NEO_READY_EVENT:provider:ready');
        } else {
          this.neoSubject.error(
            new Error('common dAPI method failed to load.')
          );
          this.logError(
            'NEO_READY_EVENT:provider:fail',
            new Error('common dAPI method failed to load.')
          );
        }
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        this.neoSubject.error(e);
        this.logError('NEO_READY_EVENT:handler:error', e);
      }
    });

    window.addEventListener(N3_READY_EVENT, () => {
      try {
        const w = window as Window;
        if (!w.NEOLineN3?.Init) {
          this.n3Subject.error(
            new Error('NEOLineN3 Init not available on READY event.')
          );
          this.logError(
            'N3_READY_EVENT:Init:missing',
            new Error('NEOLineN3 Init not available on READY event.')
          );
          return;
        }
        const neolineN3 = new w.NEOLineN3.Init();
        if (neolineN3) {
          this.n3Subject.next(neolineN3);
          this.debug('N3_READY_EVENT:provider:ready');
        } else {
          this.n3Subject.error(new Error('N3 dAPI method failed to load.'));
          this.logError(
            'N3_READY_EVENT:provider:fail',
            new Error('N3 dAPI method failed to load.')
          );
        }
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        this.n3Subject.error(e);
        this.logError('N3_READY_EVENT:handler:error', e);
      }
    });
  }
}
