export type NeoChainId = 0 | 1 | 2 | 3 | 6;

export interface GetNetworksResponse {
  chainId: NeoChainId;
  networks: string[];
  defaultNetwork: string;
}

export interface NeolineN3Provider {
  getNetworks(): Promise<GetNetworksResponse>;
  getAccount(): Promise<GetAccountResponse>;
  getPublicKey(): Promise<GetPublicKeyResponse>;
  getProvider(): Promise<GetProviderResponse>;
  getStorage(params: GetStorageParams): Promise<GetStorageResponse>;
  getBalance(): Promise<GetBalanceResponse>;
  invokeRead(params: InvokeReadParams): Promise<InvokeReadResponse>;
  invokeReadMulti(
    params: InvokeReadMultiParams
  ): Promise<InvokeReadMultiResponse>;
  verifyMessageV2(
    params: VerifyMessageV2Params
  ): Promise<VerifyMessageV2Response>;
  getBlock(params: GetBlockParams): Promise<GetBlockResponse>;
  getTransaction(params: GetTransactionParams): Promise<GetTransactionResponse>;
  getApplicationLog(
    params: GetApplicationLogParams
  ): Promise<GetApplicationLogResponse>;
  pickAddress(): Promise<PickAddressResponse>;
  AddressToScriptHash(
    params: AddressToScriptHashParams
  ): Promise<AddressToScriptHashResponse>;
  ScriptHashToAddress(
    params: ScriptHashToAddressParams
  ): Promise<ScriptHashToAddressResponse>;
  send(params: SendParams): Promise<SendResponse>;
  invoke(params: InvokeParams): Promise<InvokeResponse>;
  invokeMultiple(params: InvokeMultipleParams): Promise<InvokeResponse>;
  signMessageV2(params: SignMessageV2Params): Promise<SignMessageV2Response>;
  signMessageWithoutSaltV2(
    params: SignMessageWithoutSaltV2Params
  ): Promise<SignMessageWithoutSaltV2Response>;
  signTransaction(
    params: SignTransactionParams
  ): Promise<SignTransactionResponse>;
  switchWalletNetwork(params: SwitchWalletNetworkParams): Promise<null>;
  switchWalletAccount(): Promise<null>;
  addEventListener<E extends CommonEventName>(
    event: E,
    handler: (payload: CommonEventPayloadMap[E]) => void
  ): void;
  removeEventListener<E extends CommonEventName>(
    event: E,
    handler: (payload: CommonEventPayloadMap[E]) => void
  ): void;
}

export interface NeolineN3Constructor {
  Init: new () => NeolineN3Provider;
}

export interface GetAccountResponse {
  address: string;
  label?: string;
  isLedger: boolean;
}

export interface GetPublicKeyResponse {
  address: string;
  publicKey: string;
}

export interface GetProviderResponse {
  name: string;
  website: string;
  version: string;
  compatibility: string[];
  // Provider-specific attributes
  // Use a safe index signature instead of `object`
  extra: Record<string, unknown>;
}

export interface GetStorageParams {
  scriptHash: string;
  key: string;
}

export interface GetStorageResponse {
  result: string;
}

export interface GetBalanceItem {
  symbol: string;
  amount: string;
  contract: string;
}

export type GetBalanceResponse = GetBalanceItem[];

// ===== invokeRead types =====
export type ArgumentType =
  | 'String'
  | 'Boolean'
  | 'Hash160'
  | 'Hash256'
  | 'Integer'
  | 'ByteArray'
  | 'Array'
  | 'Address';

export type Argument =
  | { type: 'Boolean'; value: boolean }
  | { type: Exclude<ArgumentType, 'Array' | 'Boolean'>; value: string }
  | { type: 'Array'; value: Argument[] };

export interface WitnessRuleBase<T extends string> {
  type: T;
}

export interface BooleanWitnessCondition extends WitnessRuleBase<'Boolean'> {
  expression: boolean;
}

export interface AndWitnessCondition extends WitnessRuleBase<'And'> {
  expressions: WitnessCondition[];
}

export interface NotWitnessCondition extends WitnessRuleBase<'Not'> {
  expression: WitnessCondition;
}

export interface OrWitnessCondition extends WitnessRuleBase<'Or'> {
  expressions: WitnessCondition[];
}

export interface ScriptHashWitnessCondition
  extends WitnessRuleBase<'ScriptHash'> {
  hash: string;
}

export interface GroupWitnessCondition extends WitnessRuleBase<'Group'> {
  group: string;
}

export type CalledByEntryWitnessCondition = WitnessRuleBase<'CalledByEntry'>;

export interface CalledByContractWitnessCondition
  extends WitnessRuleBase<'CalledByContract'> {
  hash: string;
}

export interface CalledByGroupWitnessCondition
  extends WitnessRuleBase<'CalledByGroup'> {
  group: string;
}

export type WitnessCondition =
  | BooleanWitnessCondition
  | AndWitnessCondition
  | NotWitnessCondition
  | OrWitnessCondition
  | ScriptHashWitnessCondition
  | GroupWitnessCondition
  | CalledByEntryWitnessCondition
  | CalledByContractWitnessCondition
  | CalledByGroupWitnessCondition;

export interface WitnessRule {
  action: 'Deny' | 'Allow';
  condition: WitnessCondition;
}

export interface Signer {
  account: string; // script hash
  scopes: number;
  allowedContracts?: string[];
  allowedGroups?: string[];
  rules?: WitnessRule[];
}

export interface InvokeReadParams {
  scriptHash: string;
  operation: string;
  args: Argument[];
  signers?: Signer[];
}

export interface InvokeReadResponse {
  script: string;
  state: string;
  gas_consumed: string;
  stack: Argument[];
}

export interface InvokeReadMultiItem {
  scriptHash: string;
  operation: string;
  args: Argument[];
}

export interface InvokeReadMultiParams {
  invokeReadArgs: InvokeReadMultiItem[];
  signers?: Signer[];
}

export type InvokeReadMultiResponse = Array<{
  script: string;
  state: string;
  gas_consumed?: string;
  stack: Argument[];
}>;

export interface VerifyMessageV2Params {
  message: string;
  data: string;
  publicKey: string;
}

export interface VerifyMessageV2Response {
  result: boolean;
}

export interface GetBlockParams {
  // Some wallets accept hash or index; keep broad
  blockHashOrIndex: string | number;
}

export type GetBlockResponse = unknown;

export interface GetTransactionParams {
  txid: string;
}

export type GetTransactionResponse = unknown;

export interface GetApplicationLogParams {
  txid: string;
}

export type GetApplicationLogResponse = unknown;

export interface PickAddressResponse {
  label: string;
  address: string;
}

export interface AddressToScriptHashParams {
  address: string;
}

export interface AddressToScriptHashResponse {
  scriptHash: string;
}

export interface ScriptHashToAddressParams {
  scriptHash: string;
}

export interface ScriptHashToAddressResponse {
  address: string;
}

// ===== Write: send =====
export interface SendParams {
  fromAddress: string;
  toAddress: string;
  asset: string; // symbol or script hash (symbol accepted only on MainNet per docs)
  amount: string; // parsed amount
  fee?: string; // parsed GAS
  broadcastOverride?: boolean;
}

export interface SendResponse {
  txid: string;
  nodeURL?: string;
  signedTx?: string; // present when broadcastOverride=true
}

// ===== Write: invoke =====
export interface InvokeParams {
  scriptHash: string;
  operation: string;
  args: Argument[];
  fee?: string;
  extraSystemFee?: string;
  overrideSystemFee?: string;
  broadcastOverride?: boolean;
  signers: Signer[];
}

export interface InvokeResponse {
  txid: string;
  nodeURL?: string;
  signedTx?: string; // present when broadcastOverride=true
}

export interface InvokeArguments {
  scriptHash: string;
  operation: string;
  args: Argument[];
}

export interface InvokeMultipleParams {
  fee?: string;
  extraSystemFee?: string;
  overrideSystemFee?: string;
  invokeArgs?: InvokeArguments[];
  broadcastOverride?: boolean;
  signers: Signer[];
}

export interface SignMessageV2Params {
  message: string;
  isJsonObject?: boolean;
}

export interface SignMessageV2Response {
  publicKey: string;
  data: string;
  salt: string;
  message: string;
}

export interface SignMessageWithoutSaltV2Params {
  message: string;
  isJsonObject?: boolean;
}

export interface SignMessageWithoutSaltV2Response {
  publicKey: string;
  data: string;
  message: string;
}

export interface TransactionLike {
  version: number;
  nonce: number;
  systemFee: number;
  networkFee: number;
  validUntilBlock: number;
  attributes: unknown[];
  signers: Array<{ account: string; scopes: number }>;
  witnesses: unknown[];
  script: string;
}

export interface SignTransactionParams {
  transaction: TransactionLike;
  magicNumber?: number;
}

export type SignTransactionResponse = TransactionLike;

export interface SwitchWalletNetworkParams {
  chainId: number;
}

export type NeolineErrorType =
  | 'NO_PROVIDER'
  | 'CONNECTION_DENIED'
  | 'RPC_ERROR'
  | 'MALFORMED_INPUT'
  | 'CANCELED'
  | 'INSUFFICIENT_FUNDS'
  | 'CHAIN_NOT_MATCH'
  | 'SCRIPT_ERROR'
  | 'FAIL';

export interface NeolineError {
  type: NeolineErrorType | 'UNKNOWN';
  description: string;
  data: string;
}

export function isNeolineError(err: unknown): err is NeolineError {
  if (!err || typeof err !== 'object') return false;
  const e = err as Record<string, unknown>;
  return (
    typeof e['type'] === 'string' &&
    typeof e['description'] === 'string' &&
    typeof e['data'] === 'string'
  );
}

export type CommonEventName =
  | 'ACCOUNT_CHANGED'
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'NETWORK_CHANGED'
  | 'BLOCK_HEIGHT_CHANGED'
  | 'TRANSACTION_CONFIRMED';

export interface CommonEventPayloadMap {
  ACCOUNT_CHANGED: unknown;
  CONNECTED: unknown;
  DISCONNECTED: unknown;
  NETWORK_CHANGED: unknown;
  BLOCK_HEIGHT_CHANGED: unknown;
  TRANSACTION_CONFIRMED: unknown;
}
