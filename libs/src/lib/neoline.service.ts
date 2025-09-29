import { Injectable } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class NeolineService {
  private readonly neoSubject = new ReplaySubject<unknown>(1);
  private readonly n3Subject = new ReplaySubject<NeolineN3Provider>(1);

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
    return firstValueFrom(this.neoline$);
  }

  async getNeolineN3(): Promise<NeolineN3Provider> {
    return firstValueFrom(this.neolineN3$);
  }

  async getNetworks(): Promise<GetNetworksResponse> {
    const n3 = await this.getNeolineN3();
    return n3.getNetworks();
  }

  async getAccount(): Promise<GetAccountResponse> {
    const n3 = await this.getNeolineN3();
    return n3.getAccount();
  }

  async getPublicKey(): Promise<GetPublicKeyResponse> {
    const n3 = await this.getNeolineN3();
    return n3.getPublicKey();
  }

  async getProvider(): Promise<GetProviderResponse> {
    const n3 = await this.getNeolineN3();
    return n3.getProvider();
  }

  async getStorage(params: GetStorageParams): Promise<GetStorageResponse> {
    const n3 = await this.getNeolineN3();
    return n3.getStorage(params);
  }

  async getBalance(): Promise<GetBalanceResponse> {
    const n3 = await this.getNeolineN3();
    return n3.getBalance();
  }

  async invokeRead(params: InvokeReadParams): Promise<InvokeReadResponse> {
    const n3 = await this.getNeolineN3();
    return n3.invokeRead(params);
  }

  async invokeReadMulti(
    params: InvokeReadMultiParams
  ): Promise<InvokeReadMultiResponse> {
    const n3 = await this.getNeolineN3();
    return n3.invokeReadMulti(params);
  }

  async verifyMessageV2(
    params: VerifyMessageV2Params
  ): Promise<VerifyMessageV2Response> {
    const n3 = await this.getNeolineN3();
    return n3.verifyMessageV2(params);
  }

  async getBlock(params: GetBlockParams): Promise<GetBlockResponse> {
    const n3 = await this.getNeolineN3();
    return n3.getBlock(params);
  }

  async getTransaction(
    params: GetTransactionParams
  ): Promise<GetTransactionResponse> {
    const n3 = await this.getNeolineN3();
    return n3.getTransaction(params);
  }

  async getApplicationLog(
    params: GetApplicationLogParams
  ): Promise<GetApplicationLogResponse> {
    const n3 = await this.getNeolineN3();
    return n3.getApplicationLog(params);
  }

  async pickAddress(): Promise<PickAddressResponse> {
    const n3 = await this.getNeolineN3();
    return n3.pickAddress();
  }

  async addressToScriptHash(
    params: AddressToScriptHashParams
  ): Promise<AddressToScriptHashResponse> {
    const n3 = await this.getNeolineN3();
    return n3.AddressToScriptHash(params);
  }

  async scriptHashToAddress(
    params: ScriptHashToAddressParams
  ): Promise<ScriptHashToAddressResponse> {
    const n3 = await this.getNeolineN3();
    return n3.ScriptHashToAddress(params);
  }

  async send(params: SendParams): Promise<SendResponse> {
    const n3 = await this.getNeolineN3();
    return n3.send(params);
  }

  async invoke(params: InvokeParams): Promise<InvokeResponse> {
    const n3 = await this.getNeolineN3();
    return n3.invoke(params);
  }

  async invokeMultiple(params: InvokeMultipleParams): Promise<InvokeResponse> {
    const n3 = await this.getNeolineN3();
    return n3.invokeMultiple(params);
  }

  async signMessageV2(
    params: SignMessageV2Params
  ): Promise<SignMessageV2Response> {
    const n3 = await this.getNeolineN3();
    return n3.signMessageV2(params);
  }

  async signMessageWithoutSaltV2(
    params: SignMessageWithoutSaltV2Params
  ): Promise<SignMessageWithoutSaltV2Response> {
    const n3 = await this.getNeolineN3();
    return n3.signMessageWithoutSaltV2(params);
  }

  async signTransaction(
    params: SignTransactionParams
  ): Promise<SignTransactionResponse> {
    const n3 = await this.getNeolineN3();
    return n3.signTransaction(params);
  }

  async switchWalletNetwork(params: SwitchWalletNetworkParams): Promise<null> {
    const n3 = await this.getNeolineN3();
    return n3.switchWalletNetwork(params);
  }

  async switchWalletAccount(): Promise<null> {
    const n3 = await this.getNeolineN3();
    return n3.switchWalletAccount();
  }

  on<E extends CommonEventName>(
    event: E
  ): Observable<CommonEventPayloadMap[E]> {
    return new Observable<CommonEventPayloadMap[E]>((subscriber) => {
      let provider: NeolineN3Provider | undefined;
      const handler = (payload: CommonEventPayloadMap[E]) =>
        subscriber.next(payload);

      this.getNeolineN3()
        .then((n3) => {
          provider = n3;
          n3.addEventListener(event, handler);
        })
        .catch((err) => subscriber.error(err));

      return () => {
        if (provider) {
          try {
            provider.removeEventListener(event, handler);
          } catch {
            // ignore
          }
        }
      };
    });
  }

  private initializeEventListeners(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // If the extension already injected the objects, initialize immediately
    try {
      const w = window as Window;
      if (w.NEOLine?.Init) {
        const instance = new w.NEOLine.Init();
        if (instance) {
          this.neoSubject.next(instance);
        } else {
          this.neoSubject.error(
            new Error('common dAPI method failed to load.')
          );
        }
      }
      if (w.NEOLineN3?.Init) {
        const instanceN3 = new w.NEOLineN3.Init();
        if (instanceN3) {
          this.n3Subject.next(instanceN3);
        } else {
          this.n3Subject.error(new Error('N3 dAPI method failed to load.'));
        }
      }
    } catch {
      // Ignore and rely on events below
    }

    window.addEventListener(NEO_READY_EVENT, () => {
      try {
        const w = window as Window;
        if (!w.NEOLine?.Init) {
          this.neoSubject.error(
            new Error('NEOLine Init not available on READY event.')
          );
          return;
        }
        const neoline = new w.NEOLine.Init();
        if (neoline) {
          this.neoSubject.next(neoline);
        } else {
          this.neoSubject.error(
            new Error('common dAPI method failed to load.')
          );
        }
      } catch (err) {
        this.neoSubject.error(
          err instanceof Error ? err : new Error(String(err))
        );
      }
    });

    window.addEventListener(N3_READY_EVENT, () => {
      try {
        const w = window as Window;
        if (!w.NEOLineN3?.Init) {
          this.n3Subject.error(
            new Error('NEOLineN3 Init not available on READY event.')
          );
          return;
        }
        const neolineN3 = new w.NEOLineN3.Init();
        if (neolineN3) {
          this.n3Subject.next(neolineN3);
        } else {
          this.n3Subject.error(new Error('N3 dAPI method failed to load.'));
        }
      } catch (err) {
        this.n3Subject.error(
          err instanceof Error ? err : new Error(String(err))
        );
      }
    });
  }
}
