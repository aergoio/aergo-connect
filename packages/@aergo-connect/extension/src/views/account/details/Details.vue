<template>
  <ScrollView class="page detail-page">
    <ExportAccountDialog :visible="exportAccountDialogVisible" @close="exportAccountDialogVisible=false" />

    <div class="content detail-top">
      <AccountBalance :account="account" :tokenPriceInfo="tokenPriceInfo" />

      <Button v-if="canExport" @click="exportAccountDialogVisible = true" type="icon"><Icon name="account-export" :size="36" /></Button>

      <span class="display-on-ledger" @click="displayOnLedger">
        <span class="display-text">Display on device</span>
        <span v-if="account && account.data && account.data.type === 'ledger'" class="account-label account-label-usb"><Icon name="usb" :size="17" /></span>
      </span>
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
          <StakeDetails />
          <NameDetails />
        </div>
      </div>
    </div>
    <LoadingDialog :visible="statusDialogVisible" @close="statusDialogVisible=false" :state="dialogState">
      <p v-if="dialogState !== 'error'">{{statusText}}</p>
      <p v-else class="error">{{statusText}}</p>
    </LoadingDialog>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView, LoadingDialog } from '@aergo-connect/lib-ui/src/layouts';
import { FormattedToken, Identicon } from '@aergo-connect/lib-ui/src/content';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import { Button, ClipboardButton } from '@aergo-connect/lib-ui/src/buttons';

import Vue from 'vue';
import Component from 'vue-class-component'
import { Account } from '@herajs/wallet';
import ExportAccountDialog from '../../../components/account/ExportAccountDialog.vue';
import AccountBalance from '../../../components/account/Balance.vue';
import NameDetails from '../../../components/account/NameDetails.vue';
import StakeDetails from '../../../components/account/StakeDetails.vue';

import Transport from '@ledgerhq/hw-transport-webusb';
import LedgerAppAergo from '@herajs/ledger-hw-app-aergo';
import { timedAsync } from 'timed-async/index.js';

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
    NameDetails,
    StakeDetails,
    LoadingDialog,
  },
})
export default class AccountDetails extends Vue {
  exportAccountDialogVisible = false;
  tokenPriceInfo: any = {};
  staking: any = {};
  statusText = '';
  statusDialogVisible = false;
  dialogState: 'loading' | 'success' | 'error' = 'loading';

  setStatus(state: 'loading' | 'success' | 'error', text: string) {
    this.dialogState = state;
    this.statusText = text;
    this.statusDialogVisible = true;
  }

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
    // Clear Send dialog's persisted input
    this.$store.commit('ui/clearInput', { key: 'send' });
    this.$background.getTokenPrice(this.$route.params.chainId).then(priceInfo => {
      this.tokenPriceInfo = priceInfo;
    });
  }

  async displayOnLedger() {
    this.setStatus('loading', 'Connecting to Ledger device...');
    const transport = await timedAsync(Transport.create(5000), { fastTime: 1000 });
    const app = new LedgerAppAergo(transport);
    await app.getWalletAddress(this.account.data.derivationPath);
    await app.displayAccount();
    this.setStatus('success', 'You can verify the address on the device.');
    setTimeout(() => {
      this.statusDialogVisible = false;
    }, 3000);
  }
}
</script>

<style lang="scss">
.detail-box {
  border-radius: 2px;
  box-shadow: 0 12px 20px 0 rgba(34, 34, 34, 0.08);
  min-height: 200px;
  background-color: #fafafa;
  font-size: (13/16)*1rem;

  .account-address {
    word-break: break-all;
    line-height: 1.3;
    font-size: .95em;
    color: #000;
    display: flex;
    align-items: center;
    .copy-button {
      margin-left: 10px;
    }
  }
  .account-detail-address {
    padding: 20px 20px 12px;
    box-shadow: inset 0 -1px 0 0 #f2f2f2;
    background-color: #fff;
  }
}

/* Two-tone trick effect. Extend the upper (white) box and then pull the lower (black) box up */
.content.detail-top {
  background-color: #fff;
  padding-bottom: 80px;
  display: flex;
  align-items: flex-start;
  position: relative;

  .detail-balance {
    flex: 1;
  }
}
.detail-bottom {
  margin-top: -100px;
  flex: 1;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  
  .content {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .detail-box {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
.detail-page {
  background-color: #222;

  main {
    display: flex;
    flex-direction: column;
  }

  .account-label {
    display: inline-block;
    border-radius: 10px;
    width: 36px;
    line-height: 20px;
    text-align: center;
    vertical-align: middle;
  }
  .account-label-usb {
    background-color: #6F6F6F;
    .icon {
      line-height: 10px;
      height: 10px;
      transform: translateY(-1px);
    }
  }
}

.display-on-ledger {
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 12px;
  padding: 2px;
  cursor: pointer;
  white-space: nowrap;
  .display-text {
    display: none;
    font-size: (10/16)*1rem;
    margin: 0 4px;
    color: #000;
  }
  &:hover {
    background-color: #f0f0f0;
    .display-text {
      display: inline;
    }
  }
}
</style>