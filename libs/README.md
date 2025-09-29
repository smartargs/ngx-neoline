# @smartargs/ngx-neoline

Typed Angular service wrapper for the NeoLine N3 dAPI. It detects the injected NeoLine provider, waits for READY events, and exposes typed methods for common, read, write, and event APIs.

## Install

```bash
npm install @smartargs/ngx-neoline
```

Requires the NeoLine N3 browser extension to be installed and active.

## Quick start

```ts
import { Component, inject } from '@angular/core';
import { NeolineService } from '@smartargs/ngx-neoline';

@Component({ selector: 'demo', template: '' })
export class DemoComponent {
  private readonly neoline = inject(NeolineService);

  async ngOnInit() {
    const networks = await this.neoline.getNetworks();
    console.log('chainId', networks.chainId);
  }
}
```

No module setup needed; `NeolineService` is provided in root.

## Features

- Init via READY events for NEO2/N3
- Common methods: `getNetworks`, `getAccount`, `getPublicKey`
- Read methods: `getProvider`, `getBalance`, `getStorage`, `invokeRead`, `invokeReadMulti`, `verifyMessageV2`, `getBlock`, `getTransaction`, `getApplicationLog`, `pickAddress`, `AddressToScriptHash`, `ScriptHashToAddress`
- Write methods: `send`, `invoke`, `invokeMultiple`, `signMessageV2`, `signMessageWithoutSaltV2`, `signTransaction`, `switchWalletNetwork`, `switchWalletAccount`
- Events: `on(event)` Observable wrapper using provider `addEventListener`/`removeEventListener`

Docs: https://tutorial.neoline.io/reference/neo3-provider-api

## Usage snippets

Common

```ts
const { chainId, networks, defaultNetwork } = await neoline.getNetworks();
const account = await neoline.getAccount();
```

Read

```ts
const provider = await neoline.getProvider();
const storage = await neoline.getStorage({ scriptHash, key: 'token0' });
const read = await neoline.invokeRead({
  scriptHash,
  operation: 'balanceOf',
  args: [{ type: 'Address', value: address }],
});
```

Write

```ts
const sendRes = await neoline.send({
  fromAddress,
  toAddress,
  asset: 'GAS',
  amount: '1',
  fee: '0.0001',
});
const invRes = await neoline.invoke({
  scriptHash,
  operation,
  args,
  signers,
  broadcastOverride: true,
});
```

Events

```ts
const sub = neoline.on('ACCOUNT_CHANGED').subscribe((e) => console.log(e));
```

## Errors

All NeoLine-dAPI errors follow `{ type: string; description?: string; data?: string }` per docs: https://tutorial.neoline.io/reference/neo3-provider-api/errors/errors

Recommended handling with the exported `isNeolineError` guard:

```ts
import { isNeolineError } from '@smartargs/ngx-neoline';

try {
  await neoline.getNetworks();
} catch (err) {
  if (isNeolineError(err)) {
    console.error(err.type, err.description, err.data);
  } else {
    console.error(err);
  }
}
```
