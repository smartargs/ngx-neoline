import { Component, inject } from '@angular/core';
import { NeolineService } from '@smartargs/ngx-neoline';

@Component({
  imports: [],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'ngx-neoline-project';

  readonly #neoline = inject(NeolineService);

  async testGetNetworks(): Promise<void> {
    try {
      const result = await this.#neoline.getNetworks();
      console.log('[NeoLine getNetworks]', result);
      alert(
        `chainId=${result.chainId}, defaultNetwork=${
          result.defaultNetwork
        }, networks=${result.networks.join(',')}`
      );
    } catch (err) {
      console.error('[NeoLine getNetworks] error', err);
      alert(
        'getNetworks error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testGetStorage(): Promise<void> {
    try {
      const result = await this.#neoline.getStorage({
        scriptHash: '0x0000000000000000000000000000000000000000',
        key: 'token0',
      });
      console.log('[NeoLine getStorage]', result);
      alert(`storage.result=${result.result}`);
    } catch (err) {
      console.error('[NeoLine getStorage] error', err);
      alert(
        'getStorage error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testGetBalance(): Promise<void> {
    try {
      const result = await this.#neoline.getBalance();
      console.log('[NeoLine getBalance]', result);
      alert('Balance response logged to console');
    } catch (err) {
      console.error('[NeoLine getBalance] error', err);
      alert(
        'getBalance error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testInvokeRead(): Promise<void> {
    try {
      const result = await this.#neoline.invokeRead({
        scriptHash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
        operation: 'transfer',
        args: [
          {
            type: 'Hash160',
            value: '0xebae4ab3f21765e5f604dfdd590fdf142cfb89fa',
          },
          {
            type: 'Hash160',
            value: '0xebae4ab3f21765e5f604dfdd590fdf142cfb89fa',
          },
          { type: 'Integer', value: '10000' },
          { type: 'String', value: '' },
        ],
        signers: [
          { account: '2cab903ff032ac693f8514581665be534beac39f', scopes: 1 },
        ],
      });
      console.log('[NeoLine invokeRead]', result);
      alert(`state=${result.state}, gas=${result.gas_consumed}`);
    } catch (err) {
      console.error('[NeoLine invokeRead] error', err);
      alert(
        'invokeRead error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testInvokeReadMulti(): Promise<void> {
    try {
      const result = await this.#neoline.invokeReadMulti({
        invokeReadArgs: [
          {
            scriptHash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
            operation: 'balanceOf',
            args: [
              { type: 'Address', value: 'NaUjKgf5vMuFt7Ffgfffcpc41uH3adx1jq' },
            ],
          },
          {
            scriptHash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
            operation: 'balanceOf',
            args: [
              { type: 'Address', value: 'NaUjKgf5vMuFt7Ffgfffcpc41uH3adx1jq' },
            ],
          },
        ],
        signers: [
          { account: '2cab903ff032ac693f8514581665be534beac39f', scopes: 1 },
        ],
      });
      console.log('[NeoLine invokeReadMulti]', result);
      alert(`multi results: ${result.length}`);
    } catch (err) {
      console.error('[NeoLine invokeReadMulti] error', err);
      alert(
        'invokeReadMulti error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testVerifyMessageV2(): Promise<void> {
    try {
      const result = await this.#neoline.verifyMessageV2({
        message: '543e66d70a56506f0a69aff35f25f794Hello world',
        data: '4fef4abd1ced91577c89eac7909b89ec2aa3d073178c51c3074b7bc5551093b00bf274f35f8166931dc90cbd88346729e86e0bf1c3014fa3587cc167f0cafd4c',
        publicKey:
          '023e72b8b5a20c00dac7ac01ecd72354a2d7d64620d6615524bb18b9f5a6ca8ef4',
      });
      console.log('[NeoLine verifyMessageV2]', result);
      alert(`verify result: ${result.result}`);
    } catch (err) {
      console.error('[NeoLine verifyMessageV2] error', err);
      alert(
        'verifyMessageV2 error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testGetBlock(): Promise<void> {
    try {
      const result = await this.#neoline.getBlock({ blockHashOrIndex: 1 });
      console.log('[NeoLine getBlock]', result);
      alert('getBlock response logged to console');
    } catch (err) {
      console.error('[NeoLine getBlock] error', err);
      alert(
        'getBlock error: ' + (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testGetTransaction(): Promise<void> {
    try {
      const result = await this.#neoline.getTransaction({
        txid: '0x3bb4eeed0e1429e4fb0389e0f7f1ec4b4a2f1856d36a0ae3f9f7ea88b5c2b21e',
      });
      console.log('[NeoLine getTransaction]', result);
      alert('getTransaction response logged to console');
    } catch (err) {
      console.error('[NeoLine getTransaction] error', err);
      alert(
        'getTransaction error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testGetApplicationLog(): Promise<void> {
    try {
      const result = await this.#neoline.getApplicationLog({
        txid: '0xe5a5fdacad0ba4e8d34d2fa0638357adb0f05e7fc902ec150739616320870f50',
      });
      console.log('[NeoLine getApplicationLog]', result);
      alert('getApplicationLog response logged to console');
    } catch (err) {
      console.error('[NeoLine getApplicationLog] error', err);
      alert(
        'getApplicationLog error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testPickAddress(): Promise<void> {
    try {
      const result = await this.#neoline.pickAddress();
      console.log('[NeoLine pickAddress]', result);
      alert(`label=${result.label}, address=${result.address}`);
    } catch (err) {
      console.error('[NeoLine pickAddress] error', err);
      alert(
        'pickAddress error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testAddressToScriptHash(): Promise<void> {
    try {
      const result = await this.#neoline.addressToScriptHash({
        address: 'NQUN2zkzwpypEi6kvGYexy8cQKN2ycyJjF',
      });
      console.log('[NeoLine AddressToScriptHash]', result);
      alert(`scriptHash=${result.scriptHash}`);
    } catch (err) {
      console.error('[NeoLine AddressToScriptHash] error', err);
      alert(
        'AddressToScriptHash error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testScriptHashToAddress(): Promise<void> {
    try {
      const result = await this.#neoline.scriptHashToAddress({
        scriptHash: 'f0a33d62f32528c25e68951286f238ad24e30032',
      });
      console.log('[NeoLine ScriptHashToAddress]', result);
      alert(`address=${result.address}`);
    } catch (err) {
      console.error('[NeoLine ScriptHashToAddress] error', err);
      alert(
        'ScriptHashToAddress error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testSend(): Promise<void> {
    try {
      const res = await this.#neoline.send({
        fromAddress: 'NaUjKgf5vMuFt7Ffgfffcpc41uH3adx1jq',
        toAddress: 'NaUjKgf5vMuFt7Ffgfffcpc41uH3adx1jq',
        asset: 'GAS',
        amount: '0.0001',
        fee: '0.0001',
        broadcastOverride: true,
      });
      console.log('[NeoLine send]', res);
      alert(`txid=${res.txid}, signedTx=${res.signedTx ? 'yes' : 'no'}`);
    } catch (err) {
      console.error('[NeoLine send] error', err);
      alert(
        'send error: ' + (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testInvoke(): Promise<void> {
    try {
      const res = await this.#neoline.invoke({
        scriptHash: '0x1415ab3b409a95555b77bc4ab6a7d9d7be0eddbd',
        operation: 'transfer',
        args: [
          { type: 'Address', value: 'NaUjKgf5vMuFt7Ffgfffcpc41uH3adx1jq' },
          { type: 'Address', value: 'NaUjKgf5vMuFt7Ffgfffcpc41uH3adx1jq' },
          { type: 'Integer', value: '1' },
          { type: 'String', value: '' },
        ],
        fee: '0.0001',
        broadcastOverride: true,
        signers: [
          {
            account: '2cab903ff032ac693f8514581665be534beac39f',
            scopes: 16,
            allowedContracts: [
              '0x1415ab3b409a95555b77bc4ab6a7d9d7be0eddbd',
              '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
            ],
            allowedGroups: [],
          },
        ],
      });
      console.log('[NeoLine invoke]', res);
      alert(`txid=${res.txid}, signedTx=${res.signedTx ? 'yes' : 'no'}`);
    } catch (err) {
      console.error('[NeoLine invoke] error', err);
      alert(
        'invoke error: ' + (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testInvokeMultiple(): Promise<void> {
    try {
      const res = await this.#neoline.invokeMultiple({
        invokeArgs: [
          {
            scriptHash: 'ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
            operation: 'transfer',
            args: [
              { type: 'Address', value: 'NaUjKgf5vMuFt7Ffgfffcpc41uH3adx1jq' },
              { type: 'Address', value: 'NaUjKgf5vMuFt7Ffgfffcpc41uH3adx1jq' },
              { type: 'Integer', value: '1' },
              { type: 'String', value: '' },
            ],
          },
          {
            scriptHash: 'ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
            operation: 'transfer',
            args: [
              { type: 'Address', value: 'NaUjKgf5vMuFt7Ffgfffcpc41uH3adx1jq' },
              { type: 'Address', value: 'NPsCvedTnzGcwSYuoxjh7Sec5Zem2vgVmX' },
              { type: 'Integer', value: '1' },
              { type: 'String', value: '' },
            ],
          },
        ],
        fee: '0.001',
        broadcastOverride: true,
        signers: [
          { account: '2cab903ff032ac693f8514581665be534beac39f', scopes: 1 },
        ],
      });
      console.log('[NeoLine invokeMultiple]', res);
      alert(`txid=${res.txid}, signedTx=${res.signedTx ? 'yes' : 'no'}`);
    } catch (err) {
      console.error('[NeoLine invokeMultiple] error', err);
      alert(
        'invokeMultiple error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testSignMessageV2(): Promise<void> {
    try {
      const res = await this.#neoline.signMessageV2({ message: 'Hello world' });
      console.log('[NeoLine signMessageV2]', res);
      alert(`publicKey=${res.publicKey}`);
    } catch (err) {
      console.error('[NeoLine signMessageV2] error', err);
      alert(
        'signMessageV2 error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testSignMessageWithoutSaltV2(): Promise<void> {
    try {
      const res = await this.#neoline.signMessageWithoutSaltV2({
        message: 'Hello world',
      });
      console.log('[NeoLine signMessageWithoutSaltV2]', res);
      alert(`publicKey=${res.publicKey}`);
    } catch (err) {
      console.error('[NeoLine signMessageWithoutSaltV2] error', err);
      alert(
        'signMessageWithoutSaltV2 error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testSignTransaction(): Promise<void> {
    try {
      const res = await this.#neoline.signTransaction({
        transaction: {
          version: 0,
          nonce: 1262108766,
          systemFee: 997775,
          networkFee: 122862,
          validUntilBlock: 667132,
          attributes: [],
          signers: [
            { account: '8ddd95c4b5aa2b049abae570cf9bd4476e9b7667', scopes: 1 },
          ],
          witnesses: [],
          script:
            '0b110c1467769b6e47d49bcf70e5ba9a042baab5c495dd8d0c1467769b6e47d49bcf70e5ba9a042baab5c495dd8d14c01f0c087472616e736665720c14f563ea40bc283d4d0e05c48ea305b3f2a07340ef41627d5b52',
        },
      });
      console.log('[NeoLine signTransaction]', res);
      alert('Signed transaction logged to console');
    } catch (err) {
      console.error('[NeoLine signTransaction] error', err);
      alert(
        'signTransaction error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testSwitchWalletNetwork(): Promise<void> {
    try {
      await this.#neoline.switchWalletNetwork({ chainId: 3 });
      alert('Switched network to chainId=3');
    } catch (err) {
      console.error('[NeoLine switchWalletNetwork] error', err);
      alert(
        'switchWalletNetwork error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testSwitchWalletAccount(): Promise<void> {
    try {
      await this.#neoline.switchWalletAccount();
      alert('Switch account flow triggered');
    } catch (err) {
      console.error('[NeoLine switchWalletAccount] error', err);
      alert(
        'switchWalletAccount error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }
  async testGetAccount(): Promise<void> {
    try {
      const account = await this.#neoline.getAccount();
      console.log('[NeoLine getAccount]', account);
      alert(
        `address=${account.address}, label=${account.label ?? ''}, isLedger=${
          account.isLedger
        }`
      );
    } catch (err) {
      console.error('[NeoLine getAccount] error', err);
      alert(
        'getAccount error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testGetPublicKey(): Promise<void> {
    try {
      const data = await this.#neoline.getPublicKey();
      console.log('[NeoLine getPublicKey]', data);
      alert(`address=${data.address}, publicKey=${data.publicKey}`);
    } catch (err) {
      console.error('[NeoLine getPublicKey] error', err);
      alert(
        'getPublicKey error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async testGetProvider(): Promise<void> {
    try {
      const provider = await this.#neoline.getProvider();
      console.log('[NeoLine getProvider]', provider);
      alert(
        `name=${provider.name}, version=${provider.version}, website=${provider.website}`
      );
    } catch (err) {
      console.error('[NeoLine getProvider] error', err);
      alert(
        'getProvider error: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }
}
