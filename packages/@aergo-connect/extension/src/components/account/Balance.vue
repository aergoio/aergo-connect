<template>
  <div class="detail-balance">
    <span class="balance-label">Balance</span>
    <span class="account-balance" :style="{fontSize}">
      <FormattedToken :value="account.data.balance" v-if="account && account.data" />
      <span v-else>...</span>
    </span>
  </div>
</template>

<script lang="ts">
import { FormattedToken } from '@aergo-connect/lib-ui/src/content';

import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Account } from '@herajs/wallet';

@Component({
  components: {
    FormattedToken,
  },
})
export default class Balance extends Vue {
  @Prop({required: true}) readonly account!: Account;

  get textLength(): number {
    if (this.account && this.account.data) return `${this.account.data.balance}`.length;
    return 6;
  }
  get fontSize(): string {
    // Calculate rough font size based on text length
    const size = Math.max(1, Math.min(1.75, 40/this.textLength));
    return `${size}rem`;
  }
}
</script>


<style lang="scss">
.detail-balance {
  display: flex;
  flex-direction: column;
  background-color: #fff;

  .balance-label {
    font-size: (12/16)*1rem;
    font-weight: 500;
  }
  .account-balance {
    line-height: 1;
    font-size: (28/16)*1rem;
    margin: .5em 0 1em;

    .value {
      font-weight: 600;
    }
    .unit {
      font-size: (20/16)*1rem;
    }
  }
}
</style>