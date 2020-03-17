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
}

const elem = document.getElementById('app');
const name = elem ? elem.getAttribute('data-name') || '' : '';
init(name);

