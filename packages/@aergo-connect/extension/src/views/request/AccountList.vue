<template>
  <div class="account-list-view">
    <ScrollView>
      <template #header>
        <Header>
          <HeaderLogo />
        </Header>
        <div class="account-list-header">
          <Heading tag="h2">
            Select account to use
          </Heading>
        </div>
      </template>
      <div class="account-list-wrap">
        <AccountList :accounts="accounts" @select="selectAccount" />
      </div>
    </ScrollView>
  </div>
</template>

<script lang="ts">
import { ScrollView, Header } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import AccountList from '../../components/accounts/AccountList.vue';
import { Button } from '@aergo-connect/lib-ui/src/buttons';
import HeaderLogo from '@aergo-connect/lib-ui/src/icons/HeaderLogo.vue';

import Vue from 'vue';
import Component from 'vue-class-component';
import { Account } from '@herajs/wallet';

@Component({
  components: {
    ScrollView,
    Heading,
    Button,
    AccountList,
    Header,
    HeaderLogo,
  },
})
export default class AccountsList extends Vue {
  addAccountDialogVisible = false;
  get accounts(): Account[] {
    if (this.$store.state.accounts.keys.length) {
      return Object.values(this.$store.state.accounts.accounts);
    }
    return [];
  }

  mounted() {
    this.$store.dispatch('accounts/fetchAccounts');
  }

  selectAccount(account: any) {
    this.$background.setActiveAccount(account.data.spec);
  }
}
</script>

<style lang="scss">
.account-list-view {
  height: 100%;
  padding-bottom: 10px;
  box-sizing: border-box;
}
.account-list-header {
  border-bottom: 1px solid #f2f2f2;
  padding: 0 20px;
}
.account-list-wrap {
  border-radius: 2px;
  box-shadow: 0 12px 20px 0 rgba(34, 34, 34, 0.08);
  margin: 20px 20px 25px 20px;
}
</style>