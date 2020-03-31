import {
  identifyFromPrivateKey,
  encryptPrivateKey,
  encodePrivateKey,
  keystoreFromPrivateKey,
} from '@herajs/crypto';
import { Amount } from '@herajs/common';
import { Account } from '@herajs/wallet';

import Controller from './controller';
import { ChainConfig } from '../config';
import { promisifySimple } from '../utils/promisify';

interface AccountSpec {
  chainId: string;
  address: string;
}

/**
 * RPC API to be consumed by clients.
 * This interface matches the object returned by client.connectToBackground.
 */
export class Api {
  controller: Controller;
  constructor(controller: Controller) {
    this.controller = controller;
  }

  async unlock({ password }: { password: string }) {
    await this.controller.unlock(password);
    return true;
  }

  async lock() {
    this.controller.lock();
    return true;
  }

  async isSetup() {
    return await this.controller.wallet.isSetup();
  }

  async setup({ password }: any) {
    await this.controller.setupAndUnlock(password);
    return true;
  }

  async isUnlocked() {
    return this.controller.wallet.unlocked;
  }

  async reset() {
    await this.controller.wallet.deleteAllData();
    return true;
  }

  async addNetwork({ chainId, nodeUrl }: ChainConfig) {
    console.log('Adding chain', { chainId, nodeUrl });
    this.controller.wallet.useChain({ chainId, nodeUrl });
    let chains: Record<string, ChainConfig> = {};
    if (!this.controller.wallet.datastore) throw new Error('cannot open datastore');
    try {
      chains = (await this.controller.wallet.datastore.getIndex('settings').get('customChains')).data as any;
    } catch(e) {
      // not found
    }
    chains[chainId] = { chainId, nodeUrl };
    await this.controller.wallet.datastore.getIndex('settings').put({
      key: 'customChains',
      data: chains as any,
    });
    return true;
  }

  async getBlockchainStatus({ chainId }: { chainId: string }) {
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

  async getNames(accountSpec: AccountSpec) {
    this.controller.keepUnlocked();
    return await this.controller.wallet.nameManager.getNames(accountSpec);
  }

  async addName(accountSpec: AccountSpec, name: string) {
    this.controller.keepUnlocked();
    let wasAdded = false;
    try {
      await this.controller.wallet.nameManager.addName(accountSpec, name);
    } catch (e) {
      wasAdded = true;
    }
    const nameObj = await this.controller.wallet.nameManager.updateName(accountSpec, name);
    if (!wasAdded && !nameObj.data.destination) {
      // Remove it again as this was just a test
      this.controller.wallet.nameManager.removeName(accountSpec, name);
    }
    return nameObj;
  }

  async getLedgerAddress({ path }: { path: string }) {
    await this.controller.connectLedger();
    return await this.controller.wallet.accountManager.getAddressFromLedger(path);
  }

  async createAccount({ chainId }: { chainId: string }) {
    this.controller.keepUnlocked();
    const account = await this.controller.wallet.accountManager.createAccount(chainId);
    this.controller.trackAccount(account);
    return account.data.spec;
  }

  async removeAccount({ chainId, address }: AccountSpec) {
    await this.controller.wallet.accountManager.removeAccount({ chainId, address });
    return true;
  }

  async setActiveAccount({ chainId, address }: AccountSpec) {
    await this.controller.setActiveAccount({ chainId, address });
    return true;
  }

  async getActiveAccount() {
    return await this.controller.getActiveAccount();
  }

  async addAccount(accountData: Account["data"]): Promise<AccountSpec> {
    const account = await this.controller.wallet.accountManager.addAccount(accountData.spec, accountData);
    console.log('addAccount', account);
    this.controller.trackAccount(account);
    return account.data.spec;
  }

  async importAccount({ privateKey, chainId }: any): Promise<AccountSpec> {
    this.controller.keepUnlocked();
    const identity = identifyFromPrivateKey(privateKey);
    const address = identity.address;
    const account = await this.controller.wallet.accountManager.addAccount({ address, chainId });
    await this.controller.wallet.keyManager.importKey({
      account: account,
      privateKey: privateKey,
    });
    this.controller.trackAccount(account);
    return account.data.spec;
  }

  async exportAccount({ address, chainId, password, format }: any) {
    this.controller.keepUnlocked();
    const account = await this.controller.wallet.accountManager.getOrAddAccount({ address, chainId });
    const key = await this.controller.wallet.keyManager.getUnlockedKey(account);
    const privateKey = key.data.privateKey;
    if (!privateKey) throw new Error('Failed to unlock key');
    let privkeyEncrypted;
    if (format === "wif") {
      privkeyEncrypted = encodePrivateKey(await encryptPrivateKey(Uint8Array.from(privateKey), password));
    } else {
      privkeyEncrypted = JSON.stringify(await keystoreFromPrivateKey(Buffer.from(privateKey), password));
    }
    return {privateKey: privkeyEncrypted};
  }

  async sendTransaction(tx: any, chainId: string) {
    const txBody = await this.controller.sendTransaction({ txBody: tx, chainId });
    return { tx: txBody };
  }

  async prepareTransaction(tx: any, chainId: string) {
    const prearedTx = await this.controller.wallet.prepareTransaction({ address: tx.from, chainId }, tx);
    return { tx: prearedTx.txBody };
  }

  async signTransaction(tx: any, chainId: string) {
    const txBody = await this.controller.signTransaction({ txData: tx, address: tx.from, chainId });
    return { tx: txBody };
  }

  async getTransaction(chainId: string, hash: string) {
    const tx = await this.controller.wallet.getClient(chainId).getTransaction(hash);
    return JSON.parse(JSON.stringify(tx));
  }

  async getTransactionReceipt(chainId: string, hash: string) {
    const tx = await this.controller.wallet.getClient(chainId).waitForTransactionReceipt(hash);
    return JSON.parse(JSON.stringify(tx));
  }

  async getAccountTx(accountSpec: AccountSpec) {
    if (!accountSpec.address) throw new Error('getAccountTx: address required');
    this.controller.keepUnlocked();
    const txs = await this.controller.wallet.transactionManager.getAccountTransactions(accountSpec);
    txs.sort((a, b) => (a.data.ts < b.data.ts ? 1 : (a.data.ts == b.data.ts ? 0 : -1)));
    return txs;
  }

  async syncAccountState(accountSpec: AccountSpec): Promise<Account> {
    if (!accountSpec.address) throw new Error('syncAccountState: address required');
    this.controller.keepUnlocked();
    const account = await this.controller.wallet.accountManager.getOrAddAccount(accountSpec);
    return new Promise((resolve: (account: Account) => void) => {
      this.controller.trackAccount(account, resolve);
    });
  }

  async getAccountState(accountSpec: AccountSpec) {
    const state = await this.controller.wallet.getClient(accountSpec.chainId).getState(accountSpec.address);
    return {
      ...state,
      balance: state.balance.toString(),
    };
  }

  async signMessage({ address, chainId, message }: any) {
    this.controller.keepUnlocked();
    const signedMessage = await this.controller.signMessage({ address, chainId, message });
    return { signedMessage };
  }

  async getStaking(accountSpec: AccountSpec) {
    this.controller.keepUnlocked();
    const result = await this.controller.wallet.getClient(accountSpec.chainId).getStaking(accountSpec.address);
    return {
      amount: result.amount.toString(),
      when: result.when,
    };
  }

  async getPermissionRequestData(requestId: string) {
    return this.controller.requests[requestId];
  }

  async respondToPermissionRequest({ requestId, result }: any) {
    this.controller.respondToPermissionRequest(requestId, result);
    return true;
  }

  async denyPermissionRequest(requestId: string) {
    if (this.controller.requests[requestId]) {
      this.controller.respondToPermissionRequest(requestId, null, true);
      delete this.controller.requests[requestId];
    }
    return true;
  }

  async getChainInfo({ chainId }: any) {
    const chainInfo = await this.controller.wallet.getClient(chainId).getChainInfo();
    return { chainInfo: JSON.parse(JSON.stringify(chainInfo)) };
  }

  async getCreateNameTransaction(accountSpec: AccountSpec, name: string) {
    const tx = await this.controller.wallet.nameManager.getCreateNameTransaction(accountSpec, name);
    return {
      ...tx,
      amount: new Amount(tx.amount as any).formatNumber('aergo'),
      unit: 'aergo',
    };
  }
  async getUpdateNameTransaction(accountSpec: AccountSpec, name: string, newOwner: string) {
    const tx = await this.controller.wallet.nameManager.getUpdateNameTransaction(accountSpec, name, newOwner);
    return {
      ...tx,
      amount: new Amount(tx.amount as any).formatNumber('aergo'),
      unit: 'aergo',
    };
  }
}

type ApiMethodNames = Exclude<keyof Api, 'controller'>;
export type ApiMethods = Omit<Api, 'controller'>;

// Api function as a Promise, without send method
type ApiFunction<Ret> = (...args: any[]) => Promise<Ret>;
// Dnode function, with send method as final argument
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
      send({ error: `${e}` });
    }
  }
}

/**
 * This converts an Api class instance into a plain object with wrapped functions for consumption by Dnode
 * @param instance 
 */
const getWrapped = (instance: Api): Record<ApiMethodNames, DnodeFunction> => {
  const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(instance)) as ApiMethodNames[];
  return keys.reduce((classAsObj, key) => {
      classAsObj[key] = wrapApiCall((instance[key] as unknown as ApiFunction<any>).bind(instance));
      return classAsObj;
  }, {} as Record<ApiMethodNames, DnodeFunction>)
}

/**
 * Return the wrapped API to use with Dnode
 */
export function getServerApi(controller: Controller): Record<ApiMethodNames, DnodeFunction> {
  return getWrapped(new Api(controller));
}

/**
 * This converts the client side api instance to be usable with promises
 */
export function wrapClientApi(dnodeInstance: { [key in ApiMethodNames]: any }): ApiMethods {
  const apiKeys = Object.keys(getServerApi({} as any)) as ApiMethodNames[];
  for (const key of apiKeys) {
    dnodeInstance[key] = promisifySimple(dnodeInstance[key], {});
  }
  return dnodeInstance;
}
