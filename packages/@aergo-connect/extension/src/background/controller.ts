import extension from 'extensionizer';
import { EventEmitter } from 'events';
import pump from 'pump';
import Dnode from 'dnode/browser.js';
import Transport from '@ledgerhq/hw-transport-webusb';

import { Wallet, Account } from '@herajs/wallet';
import config from '../config';
import store from './store';
import { AergoscanTransactionScanner } from './tx-scanner';
import { getServerApi } from './api';

import AppState from './app-state';
//import 'whatwg-fetch';

import { Buffer } from 'buffer';
import { hashTransaction } from '@herajs/crypto';

const AUTO_LOCK_TIMEOUT = 60*1000 * 3; // 3 minutes

class BackgroundController extends EventEmitter {
  wallet: Wallet;
  id: string;
  requests: Record<string, any>;
  lastRequestId: number;
  state: AppState;
  _lockTimeout?: NodeJS.Timeout;
  uiState: {
    popupOpen: boolean;
  };
  activeAccount?: Account;

  constructor() {
    super();

    this.id = extension.runtime.id;

    this.requests = {};
    this.lastRequestId = 0;

    this.uiState = {
      popupOpen: false,
    };
    this.state = new AppState();

    this.wallet = new Wallet({
      appName: 'aergo-browser-wallet',
      instanceId: this.id,
    });
    this.wallet.use(AergoscanTransactionScanner as any);
    this.wallet.useStorage(store).then(async () => {
      if (!this.wallet.datastore) throw new Error('wallet failed to initiate storage');
      this.firstLoad();
      // Load custom defined chains
      try {
        const customChains = await this.wallet.datastore.getIndex('settings').get('customChains');
        if (customChains && customChains.data) {
          for (const chainId of Object.keys(customChains.data)) {
            // @ts-ignore
            this.wallet.useChain({ chainId, nodeUrl: customChains.data[chainId].nodeUrl});
          }
        }
      } catch (e) {
        // not found
      }
    });
    for (const chain of config.ChainConfigs) {
      this.wallet.useChain(chain);
    }

    this.wallet.keyManager.on('lock', () => {
      this.emit('update', { unlocked: false });
      console.log('[lock] locked');
    });
    this.wallet.keyManager.on('unlock', () => {
      this.emit('update', { unlocked: true });
      console.log('[lock] unlocked');
    });

    // Background script cannot access USB device
    this.wallet.keyManager.useExternalLedger = true;

    this.state.on('idle', () => {
      console.log('[state] idle, pausing trackers');
      this.wallet.accountManager.pause();
      this.wallet.transactionManager.pause();
    });
    this.state.on('active', () => {
      console.log('[state] active, resuming trackers');
      this.wallet.accountManager.resume();
      this.wallet.transactionManager.resume();
    });

    this.lock();
  }

  async firstLoad() {
    const accounts = await this.wallet.accountManager.getAccounts();
    for (const account of accounts) {
      this.trackAccount(account);
    }
  }

  lock() {
    this.wallet.lock();
  }
  
  async unlock(passphrase: string) {
    await this.wallet.unlock(passphrase);
    this.keepUnlocked();
  }

  async setupAndUnlock(passphrase: string) {
    await this.wallet.setupAndUnlock(passphrase);
    this.keepUnlocked();
  }

  async setActiveAccount({ chainId, address }: any) {
    const account = await this.wallet.accountManager.getOrAddAccount({ address, chainId });
    this.activeAccount = account;
    console.log('Active account is now', { chainId, address });
  }

  async getActiveAccount() {
    return this.activeAccount;
  }

  keepUnlocked() {
    if (this._lockTimeout) {
      clearTimeout(this._lockTimeout);
    }
    this._lockTimeout = setTimeout(() => {
      console.log('[lock] auto-locking...');
      this.lock();
    }, AUTO_LOCK_TIMEOUT);
  }

  /**
   * Returns true if the UI is currently open.
   * Currently unused, but can be used in the future to detect where notifications should be shown.
   */
  isUiOpen() {
    return this.uiState.popupOpen;
  }

  trackAccount(account: Account, onceCb?: (account: Account) => void) {
    const accountTracker = this.wallet.accountManager.trackAccount(account);
    this.wallet.transactionManager.trackAccount(account);
    accountTracker.then(t => {
      t.removeAllListeners('update');
      t.on('update', account => {
        this.emit('update', { accounts: [account] });
        if (onceCb) {
          onceCb(account);
          onceCb = undefined;
        }
      });
    });
    // Make an initial update
    this.emit('update', { accounts: [account] });
  }

  permissionRequest(type: string, data: any, senderURL: string, callback: Function, cancelCallback: Function) {
    const requestId = this.lastRequestId++;
    this.requests[requestId] = {
      type,
      data,
      senderURL,
      callback,
      cancelCallback,
    };
    extension.windows.getCurrent((window: any) => {
      const left = Math.max(0, window.left + window.width - 330);
      extension.windows.create({
        // @ts-ignore
        url: chrome.runtime.getURL(`popup-request.html?request=${requestId}`),
        type: "popup",
        width: 330,
        height: 525,
        top: window.top,
        left,
      });
    });
  }

  respondToPermissionRequest(requestId: any, result: any, respondCancel = false) {
    const request = this.requests[requestId];
    if (!request) return;
    if (respondCancel) {
      request.cancelCallback({
        error: 'user cancelled request',
      });
      return;
    }
    request.callback(result);
  }

  async signMessage({ address, chainId, message }: any) {
    this.keepUnlocked(); 
    const account = await this.wallet.accountManager.getOrAddAccount({ address, chainId });
    return await this.wallet.keyManager.signMessage(account, Buffer.from(message));
  }

  async signTransaction({ address, chainId, txData }: any) {
    this.keepUnlocked(); 
    const account = await this.wallet.accountManager.getOrAddAccount({ address, chainId });
    const preparedTxData = await this.wallet.accountManager.prepareTransaction(account, txData);
    return await this.wallet.keyManager.signTransaction(account, preparedTxData);
  }

  async sendTransaction({ txBody, chainId }: any) {
    this.keepUnlocked();
    const accountSpec = {
      address: txBody.from,
      chainId: chainId
    };
    let tx = txBody;
    if (txBody.sign) {
      // Externally pre-signed transaction
      tx = await this.wallet.prepareTransaction(accountSpec, txBody);
      tx.txBody.sign = txBody.sign;
      tx.txBody.hash = await hashTransaction(txBody, 'base58');
    }
    const txTracker = await this.wallet.sendTransaction(accountSpec, tx);
    console.log(txTracker, txTracker.transaction.txBody);
    return txTracker.transaction.txBody;
  }

  async connectLedger(): Promise<void> {
    if (this.wallet.ledger) return;
    console.log('Connecting Ledger...');
    const transport = await Transport.create(30000, 1500);
    this.wallet.connectLedger(transport);
  }

  setupCommunication(outStream: any) {
    const api = getServerApi(this);
    const dnode = Dnode(api);

    pump(
      outStream,
      dnode,
      outStream,
      (err: any) => {
        if (err) console.error(err);
      }
    );

    dnode.on('remote', (remote: any) => {
      const sendUpdate = remote.sendUpdate.bind(remote);
      this.on('update', sendUpdate);
    });

    this.state.on('change', (state: string) => {
      this.emit('update', { state });
    });
  }
}

export default BackgroundController;