import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import ui, { UiState } from './ui';
import accounts, { AccountsState } from './accounts';
import request, { RequestState } from './request';

Vue.use(Vuex)

// Persist some modules to local storage
const vuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage,
  modules: ['ui'],
});

export interface RootState {
  ui: UiState;
  accounts: AccountsState;
  request: RequestState;
}

export default new Vuex.Store<RootState>({
  modules: {
    ui,
    accounts,
    request,
  },
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    vuexLocal.plugin,
  ],
});
