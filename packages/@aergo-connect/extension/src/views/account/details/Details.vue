<template>
  <ScrollView class="page detail-page">
    <ExportAccountDialog :visible="exportAccountDialogVisible" @close="exportAccountDialogVisible=false" />

    <div class="content detail-top">
      <AccountBalance :account="account" />

      <Button v-if="canExport" @click="exportAccountDialogVisible = true" type="icon"><Icon name="account-export" :size="36" /></Button>
      <div v-if="account && account.data && account.data.type === 'ledger'" class="account-storage-note">Stored on Ledger</div>

    </div>
    <div class="detail-bottom">
      <div class="content">
        <div class="detail-box">
          <div class="account-detail-address">
            <Identicon :text="$route.params.address" />
            <div class="account-address">
              <span>{{$route.params.address}}</span>
              <ClipboardButton :value="$route.params.address" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { FormattedToken, Identicon } from '@aergo-connect/lib-ui/src/content';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import { Button, ClipboardButton } from '@aergo-connect/lib-ui/src/buttons';

import Vue from 'vue';
import Component from 'vue-class-component'
import { Account } from '@herajs/wallet';
import ExportAccountDialog from '../../../components/account/ExportAccountDialog.vue';
import AccountBalance from '../../../components/account/Balance.vue';

@Component({
  components: {
    ScrollView,
    FormattedToken,
    Identicon,
    Button,
    Icon,
    AccountBalance,
    ExportAccountDialog,
    ClipboardButton,
  },
})
export default class AccountDetails extends Vue {
  exportAccountDialogVisible = false;

  get account(): Account {
    return this.$store.getters['accounts/getAccount'](this.accountSpec);
  }

  get accountSpec() {
    return { address: this.$route.params.address, chainId: this.$route.params.chainId };
  }

  get canExport() {
    return !(this.account?.data?.type === 'ledger');
  }
  
  mounted() {
    this.$store.dispatch('accounts/updateAccount', this.accountSpec);
  }
}
</script>

<style lang="scss">
.detail-box {
  border-radius: 2px;
  box-shadow: 0 12px 20px 0 rgba(34, 34, 34, 0.08);
  min-height: 200px;
  background-color: #fff;
  font-size: (13/16)*1rem;

  .account-address {
    word-break: break-all;
    line-height: 1.3;
    color: #000;
    display: flex;
    align-items: center;
    .copy-button {
      margin-left: 10px;
    }
  }
  .account-detail-address {
    padding: 24px;
  }
}

.account-storage-note {
  color: #777;
  font-size: (12/16)*1rem;
}

/* Two-tone trick effect. Extend the upper (white) box and then pull the lower (black) box up */
.content.detail-top {
  background-color: #fff;
  padding-bottom: 80px;
  display: flex;
  align-items: flex-start;

  .detail-balance {
    flex: 1;
  }
}
.detail-bottom {
  margin-top: -100px;
}
.detail-page {
  background-color: #222;
}
</style>