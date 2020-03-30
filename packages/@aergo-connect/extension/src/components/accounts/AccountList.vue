<template>
  <ul class="account-list">
    <li v-for="[chainId, accounts] in accountsByChainId" :key="chainId">
      <div class="chainid-group" v-if="groupByChain">
        <span class="chain-id-icon">
          <Icon :name="isPublicChainId(chainId) ? 'logo' : 'network-other'" :size="36" />
        </span>
        <span class="chain-id">{{chainId}}</span>
      </div>
      <ul>
        <li v-for="account in accounts" :key="account.key" class="account-item-li" @click.capture="$emit('select', account)">
          <router-link :to="{ name: accountRoute, params: account.data.spec }">
            <div class="account-item">
              <Identicon :text="account.data.spec.address" class="circle" />
              
              <span class="account-address-balance">
                <span class="account-address">{{account.data.spec.address}}</span>
                <FormattedToken class="account-balance" :value="account.data.balance" />
              </span>
            </div>
          </router-link>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Account } from '@herajs/wallet';
import { Amount } from '@herajs/client';
import { groupBy } from '../../utils/group-by';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import { FormattedToken, Identicon } from '@aergo-connect/lib-ui/src/content';
import { isPublicChainId } from '../../config';

@Component({
  components: {
    Icon,
    Identicon,
    FormattedToken,
  },
})
export default class AccountList extends Vue {
  @Prop({type: Array, required: true}) readonly accounts!: Account[];
  @Prop({type: Boolean, default: true}) readonly groupByChain!: boolean;
  @Prop({type: String, default: 'account-details'}) readonly accountRoute!: string;

  get sortedAccounts() {
    const accounts = [...this.accounts];
    // Order by balance, reversed
    accounts.sort((a, b) => !a.data ? 0 : - (new Amount(a.data.balance)).compare((new Amount(b.data.balance))));
    // Order by chainID. This does not affect the groupBy, it just orders the groups alphabetically (e.g. aergo.io < testnet.aergo.io)
    accounts.sort((a, b) => !a.data ? 0 : a.data.spec.chainId.localeCompare(b.data.spec.chainId) );
    // Order the most recent account first
    accounts.sort((a, b) => this.recentlyNewAccount && a.key === this.recentlyNewAccount.key ? -1 : 0 );
    return accounts;
  }

  /**
   * Returns the most recently added account, if any
   */
  get recentlyNewAccount(): Account | null {
    const MaxAge = 1000*60*5; // 5 min 
    const accounts = [...this.accounts];
    // Reverse sort by date added
    accounts.sort((a, b) => {
      if (!a.data) return 0;
      const aAdded = typeof a.data.added === 'string' ? + new Date(a.data.added) : 0;
      const bAdded = typeof b.data.added === 'string' ? + new Date(b.data.added) : 0;
      return - (aAdded - bAdded);
    });
    // Pick the most recent one
    const mostRecentAdded = typeof accounts[0].data.added === 'string' ? + new Date(accounts[0].data.added) : 0;
    if (+ new Date() - mostRecentAdded < MaxAge) {
      return accounts[0];
    }
    return null;
  }

  get accountsByChainId() {
    if (this.groupByChain === false) return [['ALL', this.sortedAccounts]];
    const result = groupBy(this.sortedAccounts, item => item?.data?.spec?.chainId || '');
    return Array.from(result);
  }

  isPublicChainId(chainId: string) {
    return isPublicChainId(chainId);
  }
}
</script>

<style lang="scss">
.account-list, .account-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.account-list {
  font-size: (13/16)*1rem;

  .chain-id, .account-address {
    font-weight: 500;
  }
  .chainid-group {
    line-height: 36px;
    border-bottom: 1px solid #f0f0f0;
  }
  .chain-id-icon {
    width: 36px;
    margin-right: 14px;
  }
  li + li .chainid-group {
    border-top: 1px solid #f0f0f0;
  }
  .chainid-group, .account-item {
    padding: 16px 20px;
  }
  .account-item {
    padding-bottom: 0;
    display: flex;
  }
  .account-address-balance {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #f0f0f0;
    padding: 3px 0 16px;
    margin-left: 14px;
    font-size: (12/16)*1rem;
  }
  .account-item-li:last-child .account-address-balance {
    border-bottom: 0;
  }

  .account-address {
    word-break: break-all;
    padding-bottom: 10px;
    line-height: 1.3;
  }
}
</style>