<template>
  <InvertedColors class="tx-success-content">
    <ScrollView class="page">
      <ScrollView>
        <template #header>
          <div class="success-header">
            <SuccessIcon />
            <Heading >Transaction sent!</Heading>
          </div>
        </template>
        <div style="padding-left: 20px">
          <TxConfirm :txBody="processedTxData" :keys="['hash', 'recipient', 'amount', 'fee']" v-if="txData" />
        </div>
        <div class="updated-balance-wrap" v-if="txData">
          <div class="updated-balance-label">Updated balance</div>
          <div class="updated-balance"><span v-if="account && account.data"><FormattedToken :value="account.data.balance" /></span><span v-else>...</span></div>
        </div>
      </ScrollView>
      
      <template #footer>
        <div class="footer-content">
          <ButtonGroup vertical>
            <Button type="secondary" :to="{ name: 'account-send' }">Go back to Send page</Button>
          </ButtonGroup>
        </div>
      </template>
    </ScrollView>
  </InvertedColors>
</template>

<script lang="ts">
import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import InvertedColors from '@aergo-connect/lib-ui/src/theme/InvertedColors.vue'; 
import { SuccessIcon } from '@aergo-connect/lib-ui/src/icons'; 
import { FormattedToken } from '@aergo-connect/lib-ui/src/content';

import Component, { mixins } from 'vue-class-component';

import TxConfirm from '../../../components/account/TxConfirm.vue';

@Component({
  components: {
    ScrollView,
    Heading,
    Button,
    ButtonGroup,
    InvertedColors,
    SuccessIcon,
    TxConfirm,
    FormattedToken,
  },
})
export default class AccountSendConfirm extends mixins() {
  txData: any = null;
  txReceipt: any = null;

  get accountSpec() {
    return { address: this.$route.params.address, chainId: this.$route.params.chainId };
  }
  get account(): Account {
    return this.$store.getters['accounts/getAccount'](this.accountSpec);
  }
  get processedTxData() {
    return {
      ...this.txData,
      ...this.txReceipt,
    }
  }

  mounted() {
    this.$store.dispatch('accounts/updateAccount', this.accountSpec);
    this.$background.getTransactionReceipt(this.$route.params.chainId, this.$route.params.hash).then(result => {
      this.txReceipt = result;
    });
    this.$background.getTransaction(this.$route.params.chainId, this.$route.params.hash).then(result => {
      this.txData = result.tx;
      this.txData.payload = Buffer.from(Object.values(this.txData.payload)).toString();
    })
  }
}
</script>

<style lang="scss">
.tx-success-content {
  height: 100%;
  main {
    background-color: #1b1b1b;
    color: #fff;
  }
}
.success-header {
  padding: 20px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  .section-heading {
    font-weight: 600;
    margin-top: .3em;
    margin-bottom: 0;
  }
}
.updated-balance-wrap {
  margin: 0 20px 40px 40px;
  .updated-balance-label {
    color: #fff;
    font-size: (13/16)*1rem;
    font-weight: 500;
    margin-bottom: .5em;
  }
  .updated-balance {
    background-color: #fff;
    color: #000;
    font-weight: 500;
    font-size: (20/16)*1rem;
    line-height: 60px;
    padding: 0 15px;
    text-align: right;

  }
}
</style>