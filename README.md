# @smartargs/ngx-neoline

<p align="center">
  <img alt="Neo" src="https://img.shields.io/badge/Neo-N3-00E599?logo=neo&logoColor=white" />
  <a href="https://www.npmjs.com/package/@smartargs/ngx-neoline">
    <img alt="npm" src="https://img.shields.io/npm/v/%40smartargs%2Fngx-neoline.svg?logo=npm&label=npm&color=%23CB0000" />
  </a>
  <img alt="license" src="https://img.shields.io/badge/license-MIT-informational" />
  <img alt="angular" src="https://img.shields.io/badge/Angular-%3E%3D14-DD0031?logo=angular&logoColor=white" />
</p>

Angular service wrapper for the NeoLine N3 dAPI. Detects the injected provider, waits for READY events, and exposes typed methods for common, read, write, and event APIs.

- Library package: `@smartargs/ngx-neoline`
- npm: https://www.npmjs.com/package/@smartargs/ngx-neoline
- Demo app included in this repo for local testing

## Features

- Typed APIs
  - Common: `getNetworks`, `getAccount`, `getPublicKey`
  - Read: `getProvider`, `getBalance`, `getStorage`, `invokeRead`, `invokeReadMulti`, `verifyMessageV2`, `getBlock`, `getTransaction`, `getApplicationLog`, `pickAddress`, `AddressToScriptHash`, `ScriptHashToAddress`
  - Write: `send`, `invoke`, `invokeMultiple`, `signMessageV2`, `signMessageWithoutSaltV2`, `signTransaction`, `switchWalletNetwork`, `switchWalletAccount`
- Events: `on(event)` Observable wrapper using provider `addEventListener`/`removeEventListener`
- Error guard: `isNeolineError(err)` for safe narrowing of NeoLine error objects
- Provided in root, no module setup required

## Requirements

- Angular >= 14
- RxJS >= 7.5
- NeoLine N3 browser extension (in the user’s browser)

## Install

```bash
npm install @smartargs/ngx-neoline
```

## Quick start

```ts
import { Component, inject } from '@angular/core';
import { NeolineService } from '@smartargs/ngx-neoline';

@Component({ selector: 'app-demo', template: '' })
export class DemoComponent {
  private readonly neoline = inject(NeolineService);

  async ngOnInit() {
    const networks = await this.neoline.getNetworks();
    console.log('chainId', networks.chainId);
  }
}
```

## Events

```ts
const sub = neoline.on('ACCOUNT_CHANGED').subscribe((e) => console.log(e));
```

## Error handling

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

## Develop

- Serve demo app: `npx nx serve ngx-neoline-project`
- Build library: `npx nx build libs`

## Publish

- Build outputs to `dist/libs/`
- `libs/ng-package.json` includes `README.md` and `LICENSE` as package assets

## License

MIT. NeoLine is a separate product; this package only integrates with its public dAPI.

## Docs

NeoLine N3 provider API: https://tutorial.neoline.io/reference/neo3-provider-api
