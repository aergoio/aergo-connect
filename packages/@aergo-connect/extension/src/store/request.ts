import { Module } from 'vuex';
import { RootState } from './index';
import Vue from 'vue';

export interface RequestState {
  currentRequestId: string;
  currentRequest: {} | null;
}

function getVueInstance(instance: any): Vue {
  // @ts-ignore
  return instance._vm as Vue;
}

const storeModule: Module<RequestState, RootState> = {
  namespaced: true,
  state: {
    currentRequestId: '',
    currentRequest: null,
  },
  actions: {
    async getRequest({ commit, state }, requestId?: string) {
      if (state.currentRequest) {
        return state.currentRequest;
      }
      if (requestId) {
        commit('setRequestId', requestId);
      } else {
        requestId = state.currentRequestId;
      }
      if (!requestId) {
        throw new Error('missing requestId');
      }
      const vue = getVueInstance(this);
      const request = await vue.$background.getPermissionRequestData(requestId);
      commit('setRequest', request);
      return request;
    },
  },
  mutations: {
    setRequestId(state, requestId: string) {
      state.currentRequestId = requestId;
    },
    setRequest(state, request: {}) {
      state.currentRequest = request;
    },
  }
};

export default storeModule;
