<template>
  <div class="account-detail-staking">
    <div class="stake-balance">
      <span class="stake-label">Staked balance</span>
      <span class="stake-balance-wrap">
        <FormattedToken :value="staking.amount" v-if="staking && staking.amount" :decimalsIfAergo="0" />
        <span v-else>...</span>
        <span v-if="stakedFiatBalance"> ({{stakedFiatBalance}})</span>
      </span>
    </div>
    <a href="https://voting.aergo.io" target="_blank" class="voting-link">Manage stake and votes on Aergo Voting</a>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component'
import { FormattedToken } from '@aergo-connect/lib-ui/src/content';
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

@Component({ components: { FormattedToken, } })
export default class StakeDetails extends Vue {
  @Prop({default: null}) readonly tokenPriceInfo!: null | PriceInfo;

  state: 'initial' | 'loading' | 'loaded' | 'error' = 'initial';
  staking: any = {};

  mounted() {
    this.load();
  }

  get accountSpec() {
    return {
      address: this.$route.params.address,
      chainId: this.$route.params.chainId,
    };
  }

  get stakedFiatBalance(): string {
    if (!this.tokenPriceInfo || !this.staking || !this.staking.amount) return '';
    const aergoAmount = new Amount(this.staking.amount).formatNumber('aergo');
    const balance = Number(aergoAmount) * this.tokenPriceInfo.price;
    return formatCurrency(balance, this.tokenPriceInfo.currency);
  }

  async load() {
    if (this.state === 'initial') {
      this.state = 'loading';
    }
    this.staking = await this.$background.getStaking(this.accountSpec);
    this.state = 'loaded';
  }
}
</script>

<style lang="scss">
.account-detail-staking {
  padding: 15px 20px;
  box-shadow: inset 0 -1px 0 0 #f2f2f2;
  .stake-label {
    font-weight: 500;
    white-space: nowrap;
  }
  .stake-balance {
    display: flex;
    justify-content: space-between;
  }
  .stake-balance-wrap {
    text-align: right;
  }
  .voting-link {
    display: block;
    margin-top: 6px;
    font-size: .9em;
    color: #444;
    &:hover {
      color: #000;
    }
  }
}
</style>