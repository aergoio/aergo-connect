import Vue from 'vue';
import VueRouter, { RouteConfig, NavigationGuard } from 'vue-router';
import AccountsFrame from '../views/AccountsFrame.vue';
import AccountFrame from '../views/AccountFrame.vue';
import Welcome from '../views/accounts/Welcome.vue';
import Create from '../views/accounts/Create.vue';
import AccountsList from '../views/accounts/List.vue';
import AccountCreated from '../views/account/Created.vue';
import TabFrame from '../views/account/TabFrame.vue';
import AccountDetails from '../views/account/Details.vue';

import Dummy from '../views/Dummy.vue';

import { loadPersistedRoute, persistRoute } from './guards';

Vue.use(VueRouter);

/*
- accounts
  - welcome
  - list
  - add
    - create
    - import
    - select network
  
- account
  - add-success
  - balance
  - send
  - history
  - export
  - name
    - create
    - update

*/

const routes: RouteConfig[] = [
  { path: '/', redirect: '/accounts' },
  { path: '/accounts', component: AccountsFrame, children: [
    { path: '', redirect: 'welcome' }, // TODO: only go to welcome when no accounts existing, otherwise go to list
    { path: 'welcome', name: 'welcome', component: Welcome, meta: { index: 0, } },
    { path: 'list', name: 'accounts-list', component: AccountsList, meta: { index: 1, } },
    { path: 'create', name: 'account-create', component: Create, meta: { index: 2, } },
  ] },
  { path: '/account/:address/', component: AccountFrame, children: [
    { path: '', component: TabFrame, children: [
      { path: 'details', name: 'account-details', component: AccountDetails, alias: '' },
      { path: 'send', name: 'account-send', component: Dummy },
      { path: 'history', name: 'account-history', component: Dummy },
    ] },
    { path: 'created', name: 'account-created', component: AccountCreated },
  ] },
];

const router = new VueRouter({
  routes,
});

router.beforeEach(loadPersistedRoute);
router.beforeEach(persistRoute);

export default router;
