<template>
  <div class="detail-balance">
    <span class="balance-label">Balance</span>
    <span class="account-balance" :style="{fontSize}">
      <FormattedToken :value="account.data.balance" v-if="account && account.data" :decimalsIfAergo="3" />
      <span v-else>...</span>
    </span>
    <span class="balance-fiat" v-if="tokenPriceInfo">{{fiatBalance}}</span>
  </div>
</template>

<script lang="ts">
import { FormattedToken } from '@aergo-connect/lib-ui/src/content';

import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Account } from '@herajs/wallet';
import { Amount } from '@herajs/common';

interface PriceInfo {
  lastUpdatedAt: number;
  price: number;
  currency: string;
}

function formatCurrency(price: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
  return formatter.format(price);
}

@Component({
  components: {
    FormattedToken,
  },
})
export default class Balance extends Vue {
  @Prop({required: true}) readonly account!: Account;
  @Prop({default: null}) readonly tokenPriceInfo!: null | PriceInfo;

  get textLength(): number {
    if (this.account && this.account.data) return `${this.account.data.balance}`.length;
    return 6;
  }
  get fontSize(): string {
    // Calculate rough font size based on text length
    const size = Math.max(1, Math.min(1.75, 40/this.textLength));
    return `${size}rem`;
  }
  get fiatBalance(): string {
    if (!this.tokenPriceInfo || !this.account || !this.account.data || !this.account.data.balance || !this.tokenPriceInfo.price) return '';
    const aergoAmount = new Amount(this.account.data.balance).formatNumber('aergo');
    const balance = Number(aergoAmount) * this.tokenPriceInfo.price;
    return formatCurrency(balance, this.tokenPriceInfo.currency);
  }
}
</script>


<style lang="scss">
.detail-balance {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding-bottom: 10px;

  .balance-label {
    font-size: (12/16)*1rem;
    font-weight: 500;
  }
  .account-balance {
    line-height: 34px;
    font-size: (28/16)*1rem;
    margin: 8px 0 5px;

    .value {
      font-weight: 600;
    }
    .unit {
      font-size: (20/16)*1rem;
    }
  }
  .balance-fiat {
    color: #666;
    font-size: (14/16)*1rem;
  }
}
</style>