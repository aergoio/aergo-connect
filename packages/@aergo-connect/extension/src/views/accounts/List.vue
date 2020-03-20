<template>
  <div class="account-list-view">
    <ScrollView>
      <template #header>
        <div class="account-list-header">
          <Heading tag="h2">
            Accounts
            <Button @click="addAccountDialogVisible = true" type="icon"><Icon name="add" :size="24" /></Button>
          </Heading>
        </div>
      </template>
      <div class="account-list-wrap">
        <AccountList :accounts="accounts" />
      </div>
    </ScrollView>

    <AddAccountDialog :visible="addAccountDialogVisible" @close="addAccountDialogVisible=false" />
  </div>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import AddAccountDialog from '../../components/accounts/AddAccountDialog.vue';
import AccountList from '../../components/accounts/AccountList.vue';
import { Button } from '@aergo-connect/lib-ui/src/buttons';

import Vue from 'vue';
import Component from 'vue-class-component';
import { Account } from '@herajs/wallet';

@Component({
  components: {
    ScrollView,
    Heading,
    Button,
    Icon,
    AddAccountDialog,
    AccountList,
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
  margin: 20px 10px 25px 20px;
}
</style>