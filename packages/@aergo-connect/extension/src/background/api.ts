import {
  identifyFromPrivateKey,
  encryptPrivateKey,
  encodePrivateKey,
  keystoreFromPrivateKey,
} from '@herajs/crypto';

import Controller from './controller';

export class Api {
  controller: Controller;
  constructor(controller: Controller) {
    this.controller = controller;
  }

  async unlock({ password }: { password: string }) {
    try {
      await this.controller.unlock(password);
    } catch (e) {
      console.error(e);
      return { error: ''+e };
    }
    return {};
  }

  async lock() {
    this.controller.lock();
    return {};
  }

  async setup({ password }: any) {
    await this.controller.setupAndUnlock(password);
    return {};
  }

  async isUnlocked() {
    return this.controller.wallet.unlocked;
  }

  async reset() {
    await this.controller.wallet.deleteAllData();
    return {};
  }

  async addNetwork({ chainId, nodeUrl }: any, ) {
    console.log('Adding chain', { chainId, nodeUrl });
    this.controller.wallet.useChain({ chainId, nodeUrl });
    let chains: Record<string, any> = {};
    if (!this.controller.wallet.datastore) return { error: 'Cannot open datastore' };
    try {
      chains = (await this.controller.wallet.datastore.getIndex('settings').get('customChains')).data;
    } catch(e) {
      // not found
    }
    chains[chainId] = { chainId, nodeUrl };
    await this.controller.wallet.datastore.getIndex('settings').put({
      key: 'customChains',
      data: chains
    });
    return {};
  }

  async getBlockchainStatus({ chainId }: any, ) {
    const status = await this.controller.wallet.getClient(chainId).blockchain();
    return {
      blockHeight: status.bestHeight,
      chainId
    };
  }

  async getAccounts() {
    this.controller.keepUnlocked();
    const accounts = await this.controller.wallet.accountManager.getAccounts();
    for (const account of accounts) {
      this.controller.trackAccount(account);
    }
    return accounts;
  }

  async createAccount({ chainId }: any, ) {
    this.controller.keepUnlocked();
    
    try {
      const account = await this.controller.wallet.accountManager.createAccount(chainId);
      this.controller.trackAccount(account);
      return account.data.spec;
    } catch(e) {
      return { error: e };
    }
  }

  async removeAccount({ chainId, address }: any, ) {
    await this.controller.wallet.accountManager.removeAccount({ chainId, address });
    return {};
  }

  async setActiveAccount({ chainId, address }: any, ) {
    await this.controller.setActiveAccount({ chainId, address });
    return {};
  }

  async getActiveAccount() {
    const account = await this.controller.getActiveAccount();
    return account;
  }

  async importAccount({ privateKey, chainId }: any, ) {
    this.controller.keepUnlocked();
    const identity = identifyFromPrivateKey(privateKey);
    const address = identity.address;
    try {
      const account = await this.controller.wallet.accountManager.addAccount({ address, chainId });
      console.log('importAccount', account, privateKey);
      await this.controller.wallet.keyManager.importKey({
      account: account,
      privateKey: privateKey
      });
      this.controller.trackAccount(account);
      return account.data.spec;
    } catch(e) {
      console.error(e);
      return { error: 'Could not import account. '+e };
    }
  }

  async exportAccount({ address, chainId, password, format }: any, ) {
    this.controller.keepUnlocked();
    const account = await this.controller.wallet.accountManager.getOrAddAccount({ address, chainId });
    const key = await this.controller.wallet.keyManager.getUnlockedKey(account);
    const privateKey = key.data.privateKey;
    if (!privateKey) return { error: 'Failed to unlock key' };
    let privkeyEncrypted;
    if (format === "wif") {
      privkeyEncrypted = encodePrivateKey(await encryptPrivateKey(Uint8Array.from(privateKey), password));
    } else {
      privkeyEncrypted = JSON.stringify(await keystoreFromPrivateKey(Buffer.from(privateKey), password));
    }
    return {privateKey: privkeyEncrypted};
  }

  async sendTransaction(tx: any, chainId: any, ) {
    try {
      const txBody = await this.controller.sendTransaction({ txBody: tx, chainId });
      return { tx: txBody };
    } catch(e) {
      console.error(e);
      return { error: e.message || ''+e };
    }
  }

  async signTransaction(tx: any, chainId: any, ) {
    try {
      const txBody = await this.controller.signTransaction({ txData: tx, address: tx.from, chainId });
      return { tx: txBody };
    } catch(e) {
      console.error(e);
      return { error: e.message || ''+e };
    }
  }

  async getAccountTx(accountSpec: any, ) {
    console.log('getAccountTx', accountSpec);
    if (!accountSpec.address) return {};
    const txs = await this.controller.wallet.transactionManager.getAccountTransactions(accountSpec);
    txs.sort((a, b) => (a.data.ts < b.data.ts ? 1 : (a.data.ts == b.data.ts ? 0 : -1)));
    return txs;
  }

  async syncAccountState(accountSpec: any) {
    if (!accountSpec.address) return {};
    const account = await this.controller.wallet.accountManager.getOrAddAccount(accountSpec);
    return new Promise(resolve => {
      this.controller.trackAccount(account, resolve);
    });
  }

  async signMessage({ address, chainId, message }: any, ) {
    try {
        const signedMessage = await this.controller.signMessage({ address, chainId, message });
        return { signedMessage };
    } catch (e) {
        console.error(e);
        return { error: e };
    }
  }

  async getStaking({ address, chainId }: any, ) {
    this.controller.keepUnlocked();
    try {
      const result = await this.controller.wallet.getClient(chainId).getStaking(address);
      return {
        amount: result.amount.toString(),
        when: result.when
      };
    } catch(e) {
      return { error: e };
    }
  }

  async getPermissionRequestData(requestId: string, ) {
    return this.controller.requests[requestId];
  }

  async respondToPermissionRequest({ requestId, result }: any, ) {
    this.controller.respondToPermissionRequest(requestId, result);
    return {};
  }

  async denyPermissionRequest(requestId: string, ) {
    if (this.controller.requests[requestId]) {
      this.controller.respondToPermissionRequest(requestId, null, true);
      delete this.controller.requests[requestId];
    }
    return {};
  }

  async getChainInfo({ chainId }: any, ) {
    const chainInfo = await this.controller.wallet.getClient(chainId).getChainInfo();
    return { chainInfo: JSON.parse(JSON.stringify(chainInfo)) };
  }
}

type ApiFunction<Ret> = (...args: any[]) => Promise<Ret>;
type DnodeFunction = ((...args: any[]) => void);
/**
 * Wraps API call to use with Dnode
 */
function wrapApiCall<Ret>(fn: ApiFunction<Ret>): DnodeFunction {
  return async function(...args: any[]) {
    const send = args.pop() as (val: (Ret | { error: any })) => void;
    try {
      const result = await fn(...args);
      send(result);
    } catch (e) {
      send({ error: e });
    }
  }
}

const getWrapped = <C extends object>(instance: C): Record<keyof C, DnodeFunction> => {
  const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(instance)) as (keyof C)[];
  return keys.reduce((classAsObj, key) => {
      classAsObj[key] = wrapApiCall((instance[key] as unknown as ApiFunction<any>).bind(instance));
      return classAsObj;
  }, {} as Record<keyof C, DnodeFunction>)
}

/*
const getWrappedPrototype = <C extends object>(instance: C): Record<keyof C, DnodeFunction> => {
  const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(instance)) as (keyof C)[];
  return keys.reduce((classAsObj, key) => {
      classAsObj[key] = wrapApiCall(instance[key] as unknown as ApiFunction<any>);
      return classAsObj;
  }, {} as Record<keyof C, DnodeFunction>)
}
*/

export default function getAPI(controller: Controller): Record<keyof Api, DnodeFunction> {
  return getWrapped(new Api(controller));
}
