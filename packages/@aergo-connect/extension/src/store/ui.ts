import { Module } from 'vuex';
import { Route } from 'vue-router';
import { RootState } from './index';
import { Primitive } from '../types';

interface InputData {
  // Values get persisted into localstorage, so only use json-compatible types
  [field: string]: Primitive;
}

export interface UiState {
  route: {
    currentPath: string;
    previousPath: string;
  };
  input: {
    [form: string]: InputData;
  };
}

const storeModule: Module<UiState, RootState> = {
  namespaced: true,
  state: {
    route: {
      currentPath: '',
      previousPath: '',
    },
    input: {},
  },
  mutations: {
    setCurrentRoute(state, route: Route) {
      if (route.fullPath === state.route.currentPath) return;
      state.route.previousPath = state.route.currentPath;
      state.route.currentPath = route.fullPath;
    },
    setInput(state, { key, field, value }: { key: string; field: string; value: Primitive }) {
      if (typeof state.input[key] === 'undefined') {
        state.input[key] = {};
      }
      state.input[key][field] = value;
    },
    setInputs(state, { key, data }: { key: string; data: InputData }) {
      state.input[key] = data;
    },
  }
};

export default storeModule;

import Vue from 'vue';
import Component from 'vue-class-component'
import { debounce } from 'lodash';

/**
 * Mixin that helps persisting local component data into the vuex store,
 * from where it gets persisted into localstorage.
 */
@Component
export class PersistInputsMixin extends Vue {
  persistFields: string[] = [];
  persistDebounceTime = 500;
  persistInitialValues = true;
  get persistFieldsKey(): string {
    return `${this.$vnode.key}`;
  }
  private restorePersistedValue(field: string) {
    const key = this.persistFieldsKey;
    const state = this.$store.state.ui as UiState;
    if (typeof state.input[key] !== 'undefined') {
      const persistedValue = state.input[key][field];
      if (typeof persistedValue !== 'undefined') {
        this.$set(this, field, persistedValue);
      }
    }
  }
  private watchField(field: string) {
    const key = this.persistFieldsKey;
    const watchHandler = debounce((value: Primitive) => {
      this.$store.commit('ui/setInput', { key, field, value });
    }, this.persistDebounceTime);
    this.$watch(field, watchHandler, { immediate: this.persistInitialValues });
  }
  created() {
    for (const field of this.persistFields) {
      this.restorePersistedValue(field);
      this.watchField(field);
    }
  }
}
