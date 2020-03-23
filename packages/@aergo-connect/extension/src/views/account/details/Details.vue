<template>
  <ScrollView class="page detail-page">
    <ExportAccountDialog :visible="exportAccountDialogVisible" @close="exportAccountDialogVisible=false" />

    <div class="content detail-top">
      <AccountBalance :account="account" />

      <Button @click="exportAccountDialogVisible = true" type="icon"><Icon name="account-export" :size="36" /></Button>
    </div>
    <div class="detail-bottom">
      <div class="content">
        <div class="detail-box">
          <div class="account-detail-address">
            <Identicon :text="$route.params.address" />
            <span class="account-address">{{$route.params.address}}</span>
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
import { Button } from '@aergo-connect/lib-ui/src/buttons';
import AccountBalance from '../../../components/account/Balance.vue';

import Vue from 'vue';
import Component from 'vue-class-component'
import { Account } from '@herajs/wallet';
import ExportAccountDialog from '../../../components/account/ExportAccountDialog.vue';

@Component({
  components: {
    ScrollView,
    FormattedToken,
    Identicon,
    Button,
    Icon,
    AccountBalance,
    ExportAccountDialog,
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
  }
  .account-detail-address {
    padding: 24px;
  }
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