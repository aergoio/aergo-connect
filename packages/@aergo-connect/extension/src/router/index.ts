import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { loadPersistedRoute, persistRoute, updateTitle } from './guards';

import AccountsContainer from '../views/accounts/Container.vue';
import Lockscreen from '../views/accounts/Lockscreen.vue';
import Welcome from '../views/accounts/Welcome.vue';
import Setup from '../views/accounts/Setup.vue';
import Create from '../views/accounts/Create.vue';
import Import from '../views/accounts/import/1-Network.vue';
import ImportFormat from '../views/accounts/import/2-Format.vue';
import ImporKeystore from '../views/accounts/import/3a-Keystore.vue';
import AccountsList from '../views/accounts/List.vue';

import AccountContainer from '../views/account/Container.vue';
import AccountCreated from '../views/account/Created.vue';
import TabContainer from '../views/account/TabContainer.vue';
import AccountSend from '../views/account/Send.vue';
import AccountHistory from '../views/account/History.vue';
import AccountDetailsContainer from '../views/account/details/Container.vue';
import AccountDetails from '../views/account/details/Details.vue';
import AccountExport from '../views/account/details/Export.vue';

const routes: RouteConfig[] = [
  { path: '/', redirect: '/accounts' },
  { path: '/accounts', component: AccountsContainer, children: [
    { path: '', redirect: 'welcome' },
    { path: '/locked', name: 'lockscreen', component: Lockscreen, meta: { noAuthCheck: true } },
    { path: '/welcome', name: 'welcome', component: Welcome, meta: { index: 0, noAuthCheck: true } },
    { path: '/setup', name: 'setup', component: Setup, meta: { index: 1, noAuthCheck: true } },
    { path: 'list', name: 'accounts-list', component: AccountsList, meta: { index: 1, } },
    { path: 'create', name: 'account-create', component: Create, meta: { index: 2, } },
    { path: 'import', name: 'account-import', component: Import, meta: { index: 2, } },
    { path: 'import/format', name: 'account-import-format', component: ImportFormat, meta: { index: 3, } },
    { path: 'import/keystore', name: 'account-import-keystore', component: ImporKeystore, meta: { index: 4, } },
  ] },
  { path: '/account/:chainId/:address/', component: AccountContainer, children: [
    { path: '', component: TabContainer, children: [
      { path: 'details', component: AccountDetailsContainer, alias: '', children: [
        { path: '', name: 'account-details', component: AccountDetails },
        { path: 'export', name: 'account-export', component: AccountExport },
      ] },
      { path: 'send', name: 'account-send', component: AccountSend },
      { path: 'history', name: 'account-history', component: AccountHistory },
    ] },
    { path: 'created', name: 'account-created', component: AccountCreated },
  ] },
];

/*
- accounts
  - welcome
  - list
  - add
    - create
    - import
    - select network
  
- account
  - created
  - tabs
    - balance
      - name
        - create
        - update
    - send
    - history
  - export
*/

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});

router.beforeEach(loadPersistedRoute);
router.beforeEach(persistRoute);
router.afterEach(updateTitle);

export default router;
