import { Module } from 'vuex';
import { RootState } from './index';
import { Account, serializeAccountSpec } from '@herajs/wallet';
import Vue from 'vue';

export interface AccountsState {
  keys: string[];
  accounts: {
    [key: string]: Account;
  };
}

interface AccountSpec {
  address: string;
  chainId: string;
}

function getVueInstance(instance: any): Vue {
  // @ts-ignore
  return instance._vm as Vue;
}

const storeModule: Module<AccountsState, RootState> = {
  namespaced: true,
  state: {
    accounts: {},
    // Save keys extra for reactivity as the `accounts` object is not observable in the beginning.
    keys: [],
  },
  getters: {
    getAccount: state => (accountSpec: AccountSpec): Account | undefined => {
      const key = serializeAccountSpec(accountSpec);
      // Check state.keys to make the getter react to changes
      if (state.keys.indexOf(key) === -1) return undefined;
      return state.accounts[key];
    },
  },
  actions: {
    async fetchAccounts({ commit }) {
      const vue = getVueInstance(this);
      const accounts = await vue.$background.getAccounts();
      commit('setAccounts', accounts);
    },
    async updateAccount({ commit }, { address, chainId }: AccountSpec) {
      const vue = getVueInstance(this);
      vue.$background.setActiveAccount({ address, chainId });
      const account = await vue.$background.syncAccountState({ address, chainId });
      commit('setAccounts', [account]);
    },
  },
  mutations: {
    setAccounts(state, accounts: Account[]) {
      for (const account of accounts) {
        state.accounts[account.key] = account;
      }
      const newKeys = accounts.map(acc => acc.key).filter(key => state.keys.indexOf(key) === -1);
      state.keys.push(...newKeys);
    },
  }
};

export default storeModule;
