import Vue from 'vue';
import VueRouter from 'vue-router';
import AccountsFrame from '../views/AccountsFrame.vue';
import Welcome from '../views/accounts/Welcome.vue';
import Create from '../views/accounts/Create.vue';

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

const routes = [
  {
    path: '/',
    redirect: '/accounts',
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: AccountsFrame,
    children: [
      {
        path: '',
        redirect: 'welcome', // todo: only go to welcome when no accounts existing, otherwise go to list
      },
      {
        path: 'welcome',
        name: 'welcome',
        component: Welcome,
        meta: { index: 0, },
      },
      {
        path: 'list',
        name: 'accounts-list',
      },
      {
        path: 'create',
        name: 'account-create',
        component: Create,
        meta: { index: 1, },
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
