import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import AccountsFrame from '../views/AccountsFrame.vue';
import AccountFrame from '../views/AccountFrame.vue';
import Welcome from '../views/accounts/Welcome.vue';
import Create from '../views/accounts/Create.vue';

import Dummy from '../views/Dummy.vue';

import store from '../store';

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
  { path: '/accounts', name: 'accounts', component: AccountsFrame, children: [
    { path: '', redirect: 'welcome' }, // todo: only go to welcome when no accounts existing, otherwise go to list
    { path: 'welcome', name: 'welcome', component: Welcome, meta: { index: 0, } },
    { path: 'list', name: 'accounts-list', },
    { path: 'create', name: 'account-create', component: Create, meta: { index: 1, } },
  ] },
  { path: '/account/:address/', name: 'account', component: AccountFrame, children: [
    { path: '', name: 'account-details', component: Dummy },
  ] },
];

const router = new VueRouter({
  routes,
});

router.beforeEach(function(to, from, next) {
    // Load persisted route on initial load
    // or whenever selecting an account during permission request
    const isEntryRoute = from.fullPath === '/' && from.name === null;
    if (isEntryRoute || to.name == 'deposit') {
        const savedPath = store.state.ui.route.currentPath;
        if (savedPath && savedPath != to.fullPath) {
            next(savedPath);
            return;
        }
    }
    if (!to.meta || to.meta.donottrack !== true) {
        store.commit('ui/setCurrentRoute', to);
    }
    next();
});

export default router;
