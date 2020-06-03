<template>
  <div class="account-detail-staking">
    <div class="stake-balance">
      <span class="stake-label">Staked balance</span>
      <FormattedToken :value="staking.amount" v-if="staking" />
      <span v-else>...</span>
    </div>
    <a href="https://voting.aergo.io" target="_blank" class="voting-link">Manage stake and votes on Aergo Voting</a>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { FormattedToken } from '@aergo-connect/lib-ui/src/content';

@Component({ components: { FormattedToken, } })
export default class StakeDetails extends Vue {
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
  }
  .stake-balance {
    display: flex;
    justify-content: space-between;
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