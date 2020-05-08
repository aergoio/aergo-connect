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
import ImportKeystore from '../views/accounts/import/3a-Keystore.vue';
import ImportWif from '../views/accounts/import/3b-Wif.vue';
import ConnectHw from '../views/accounts/connect-hw/1-Network.vue';
import ConnectHwAccounts from '../views/accounts/connect-hw/2-Accounts.vue';
import AccountsList from '../views/accounts/List.vue';
import Settings from '../views/accounts/Settings.vue';
import NetworksList from '../views/accounts/networks/List.vue';
import NetworksUpdate from '../views/accounts/networks/Update.vue';

import AccountContainer from '../views/account/Container.vue';
import AccountCreated from '../views/account/Created.vue';
import ViewSeedPhrase from '../views/account/seedphrase/View.vue';
import VerifySeedPhrase from '../views/account/seedphrase/Verify.vue';
import AccountImported from '../views/account/Imported.vue';
import TabContainer from '../views/account/TabContainer.vue';
import AccountSend from '../views/account/send/1-Send.vue';
import AccountSendConfirm from '../views/account/send/2-Confirm.vue';
import AccountSendSuccess from '../views/account/send/3-Success.vue';
import AccountHistory from '../views/account/History.vue';
import AccountDetailsContainer from '../views/account/details/Container.vue';
import AccountDetails from '../views/account/details/Details.vue';
import AccountExportKeystore from '../views/account/export/Keystore.vue';
import AccountExportWif from '../views/account/export/Wif.vue';
import AccountNameCreate from '../views/account/name/Create.vue';
import AccountNameUpdate from '../views/account/name/Update.vue';
import AccountRemove from '../views/account/Remove.vue';

import RequestContainer from '../views/request/Container.vue';
import RequestSelectAccount from '../views/request/SelectAccount.vue';
import RequestSelectAction from '../views/request/SelectAction.vue';
import RequestAccountContainer from '../views/request/AccountContainer.vue';
import RequestAccountList from '../views/request/AccountList.vue';
import RequestAddress from '../views/request/Address.vue';
import RequestSign from '../views/request/Sign.vue';
import RequestSendTx from '../views/request/Send.vue';
import RequestSignTx from '../views/request/SignTx.vue';

enum R {
  None = 0,
  NoAuthCheck = 1 << 0,
  NoTracking  = 1 << 1,
}
function withMeta(index: number | undefined, route: RouteConfig, flags: R = R.None): RouteConfig {
  return {
    ...route,
    meta: {
      ...route.meta,
      index, // used for route transition animations
      noAuthCheck: (flags & R.NoAuthCheck) === R.NoAuthCheck,
      noTracking: (flags & R.NoTracking) === R.NoTracking,
    }
  }
}
const routes: RouteConfig[] = [
  { path: '/', redirect: '/accounts' },
  { path: '/accounts', component: AccountsContainer, children: [
    { path: '', redirect: 'list' },
    withMeta(0, { path: '/locked', name: 'lockscreen', component: Lockscreen }, R.NoAuthCheck | R.NoTracking),
    withMeta(0, { path: '/settings', name: 'settings', component: Settings }, R.NoAuthCheck | R.NoTracking),
    withMeta(0, { path: '/welcome', name: 'welcome', component: Welcome }, R.NoAuthCheck),
    withMeta(1, { path: '/setup/:next', name: 'setup', component: Setup }, R.NoAuthCheck | R.NoTracking),
    withMeta(1, { path: 'list', name: 'accounts-list', component: AccountsList }),
    withMeta(2, { path: 'create', name: 'account-create', component: Create }),
    withMeta(2, { path: 'import', name: 'account-import', component: Import }),
    withMeta(3, { path: 'import/format', name: 'account-import-format', component: ImportFormat }),
    withMeta(4, { path: 'import/keystore', name: 'account-import-keystore', component: ImportKeystore }),
    withMeta(4, { path: 'import/wif', name: 'account-import-wif', component: ImportWif }),
    withMeta(2, { path: 'connect-hw', name: 'account-connect-hw', component: ConnectHw }),
    withMeta(3, { path: 'connect-hw/accounts', name: 'account-connect-hw-accounts', component: ConnectHwAccounts }),
    withMeta(4, { path: 'networks', name: 'networks-list', component: NetworksList }, R.NoTracking),
    withMeta(5, { path: 'networks/create', name: 'networks-create', component: NetworksUpdate }, R.NoTracking),
    withMeta(5, { path: 'networks/:chainId', name: 'networks-update', component: NetworksUpdate }, R.NoTracking),
  ] },
  { path: '/account/:chainId/:address/', component: AccountContainer, children: [
    { path: '', component: TabContainer, children: [
      { path: 'details', component: AccountDetailsContainer, alias: '', children: [
        { path: '', name: 'account-details', component: AccountDetails },
        { path: 'export/keystore', name: 'account-export-keystore', component: AccountExportKeystore },
        { path: 'export/wif', name: 'account-export-wif', component: AccountExportWif },
        { path: 'name/create', name: 'account-name-create', component: AccountNameCreate },
        { path: 'name/:name/update', name: 'account-name-update', component: AccountNameUpdate },
      ] },
      { path: 'send', component: AccountDetailsContainer, alias: '', children: [
        { path: '', name: 'account-send', component: AccountSend },
        { path: 'confirm', name: 'account-send-confirm', component: AccountSendConfirm },
      ] },
      { path: 'history', name: 'account-history', component: AccountHistory },
    ] },
    { path: 'send/success/:hash', name: 'account-send-success', component: AccountSendSuccess },
    withMeta(1, { path: 'created', name: 'account-created', component: AccountCreated }),
    withMeta(2, { path: 'seedphrase', name: 'account-seedphrase-view', component: ViewSeedPhrase }),
    withMeta(3, { path: 'seedphrase-verify', name: 'account-seedphrase-verify', component: VerifySeedPhrase }),
    { path: 'imported', name: 'account-imported', component: AccountImported },
    { path: 'remove', name: 'account-remove', component: AccountRemove },
  ] },
  { path: '/request', component: RequestContainer, children: [
    { path: '', name: 'request-select-account', component: RequestSelectAccount },
    { path: 'list', name: 'request-accounts-list', component: RequestAccountList },
    { path: 'account/:chainId/:address/', component: RequestAccountContainer, children: [
      { path: '', name: 'request-select-action', component: RequestSelectAction },
      { path: 'address', name: 'request-address', component: RequestAddress },
      { path: 'sign', name: 'request-sign', component: RequestSign },
      { path: 'sign-tx', name: 'request-sign-tx', component: RequestSignTx },
      { path: 'send', name: 'request-send', component: RequestSendTx },
    ] },
  ] },
];

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});

/*
router.beforeEach(function(to, from, next) {
  console.log('from', from.name, 'to', to.name);
  next();
});*/
router.beforeEach(loadPersistedRoute);
router.beforeEach(persistRoute);
router.afterEach(updateTitle);

export default router;
