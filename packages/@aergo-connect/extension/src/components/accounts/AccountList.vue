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
              <span>
                <Identicon :text="account.data.spec.address" class="circle" />
                <span v-if="isNew(account)" class="account-new-label">new</span>
              </span>
              
              <span class="account-address-balance">
                <span class="account-address">{{account.data.spec.address}}</span>
                <span class="balance-actions">
                  <FormattedToken class="account-balance" :value="account.data.balance" />
                  <router-link class="delete-button" :to="{name:'account-remove', params: account.data.spec }"><Icon name="trash" :size="10" /></router-link>
                </span>
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
  @Prop({type: Boolean, default: true}) readonly highlightNew!: boolean;
  @Prop({type: String, default: 'account-details'}) readonly accountRoute!: string;
  @Prop({type: Boolean, default: false}) readonly canDelete!: boolean;

  get sortedAccounts() {
    const accounts = [...this.accounts];
    // Order by address A-Z
    accounts.sort((a, b) => a.data.spec.address.localeCompare(b.data.spec.address));
    // Order by balance, reversed
    accounts.sort((a, b) => !a.data ? 0 : - (new Amount(a.data.balance)).compare((new Amount(b.data.balance))));
    // Order by chainID A-Z. This does not affect the groupBy, it just orders the groups alphabetically (e.g. aergo.io < testnet.aergo.io)
    accounts.sort((a, b) => !a.data ? 0 : a.data.spec.chainId.localeCompare(b.data.spec.chainId) );
    // Order the most recent accounts first, but only if they are new
    if (this.highlightNew) {
      accounts.sort((a, b) => {
        // Use 0 for non-new accounts to not affect order, otherwise the added timestamp
        const addedA = this.isNew(a) && typeof a.data.added === 'string' ? + new Date(a.data.added) : 0;
        const addedB = this.isNew(b) && typeof b.data.added === 'string' ? + new Date(b.data.added) : 0;
        return - (addedA - addedB);
      });
    }
    return accounts;
  }

  get accountsByChainId() {
    if (this.groupByChain === false) return [['ALL', this.sortedAccounts]];
    const result = groupBy(this.sortedAccounts, item => item?.data?.spec?.chainId || '');
    return Array.from(result);
  }

  isPublicChainId(chainId: string) {
    return isPublicChainId(chainId);
  }

  isNew(account: Account) {
    if (!this.highlightNew) return false;
    const MaxAge = 1000*60*5; // 5 min 
    const added = typeof account.data.added === 'string' ? + new Date(account.data.added) : 0;
    return (+ new Date() - added) < MaxAge;
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
  .account-balance {
    color: #666;
  }
  .balance-actions {
    display: flex;
    align-items: center;
    .account-balance {
      flex: 1;
    }
  }
  .delete-button {
    opacity: 0;
  }
  .account-item-li:hover .delete-button {
    opacity: 1;
  }
  .delete-button .icon {
    border-radius: 100%;
    width: 24px !important;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background-color: #d9d9d9;
    }
  }

  .account-address {
    word-break: break-all;
    padding-bottom: 10px;
    line-height: 1.3;
  }
  .account-new-label {
    display: inline-block;
    transform: translateY(-5px);
    border-radius: 10px;
    background-color: #ff4f9f;
    font-size: (8/16)*1rem;
    text-transform: uppercase;
    line-height: 19px;
    width: 36px;
    text-align: center;
    color: #fff;
  }
}
</style>