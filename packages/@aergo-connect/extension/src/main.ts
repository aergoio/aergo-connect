import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import connectToBackground from './background/client';
import Background from './plugins/background';
import IndexedDb from './plugins/indexeddb';
import extension from 'extensionizer';
import PortStream from 'extension-port-stream';

import '@aergo-connect/lib-ui/src/styles/base.scss';

Vue.config.productionTip = false;

async function init(name: string) {
  const extensionPort = extension.runtime.connect({ name });
  const connectionStream = new PortStream(extensionPort);
  const background = await connectToBackground(connectionStream);

  Vue.use(Background, { background });
  Vue.use(IndexedDb);

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');

  // React to state updates from background
  background.on('update', function(state) {
    const isNonAuthPage = !(router.currentRoute.meta && router.currentRoute.meta.noAuthCheck === true);
    if (Object.prototype.hasOwnProperty.call(state, 'unlocked') && state.unlocked === false && !isNonAuthPage) {
      router.push({ name: 'lockscreen' });
    }
    if (Object.prototype.hasOwnProperty.call(state, 'accounts')) {
      store.commit('accounts/setAccounts', state.accounts);
    }
  });
}

const elem = document.getElementById('app');
const name = elem ? elem.getAttribute('data-name') || '' : '';
init(name);
