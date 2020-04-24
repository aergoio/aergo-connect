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
