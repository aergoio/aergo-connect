import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import ui, { UiState } from './ui';
import accounts from './accounts';

Vue.use(Vuex)

const vuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage,
  modules: ['ui'],
});

export interface RootState {
  ui: UiState;
}

export default new Vuex.Store<RootState>({
  modules: {
    ui,
    accounts,
  },
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    vuexLocal.plugin
  ],
});
