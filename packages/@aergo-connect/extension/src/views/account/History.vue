<template>
  <ScrollView class="page tx-history-page">
    <template #header>
      <div class="content">
        <Heading tag="h2">Transaction History</Heading>
      </div>
    </template>
    <div class="tx-list">
      <LoadingIndicator v-if="state === 'loading'" :size="50" />
      <div v-if="state === 'loaded' && transactions.length === 0" class="empty-state">No transactions found.</div>
      <div v-if="state === 'loaded' && transactions.length">
        <div class="tx-list-item" v-for="tx in transactions" :key="tx.hash" :class="'status-'+tx.data.status" @click="goToExplorer(tx)">
          <span class="tx-direction">
            <Icon :name="tx.data.to == tx.data.from ? 'tx-self' : address == tx.data.from ? 'tx-out' : 'tx-in'" :size="24" />
          </span>

          <span class="tx-info">
            <span class="address-amount">
              <span class="address">
                <Identicon :text="address == tx.data.from ? tx.data.to : tx.data.from" />
                <span v-if="tx.data.to == tx.data.from">self-transfer</span>
                <Elide v-else class="address" :text="address == tx.data.from ? tx.data.to : tx.data.from" mode="middle-fixed-tail" expect-ellipsis />
              </span>
              <FormattedToken :class="['amount', address == tx.data.from ? 'negative' : 'positive']" :prefix="address == tx.data.from ? '-' : '+'" :value="`${tx.data.amount} aer`" />
            </span>
            <span class="date-category">
              <span class="date">{{formatTimestamp(tx.data.ts)}}</span>
              <span class="catgeory">{{getCategory(tx)}}</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { FormattedToken, Identicon } from '@aergo-connect/lib-ui/src/content';
import { LoadingIndicator, Icon } from '@aergo-connect/lib-ui/src/icons';
import { Elide } from '@aergo-connect/lib-ui/src/content';

import Vue from 'vue';
import Component from 'vue-class-component'
import { Transaction } from '@herajs/wallet';
import { TxTypes } from '@herajs/common';
import { timedAsync } from 'timed-async/index.js';

import { getExplorerUrl } from '../../utils/chain-urls';

@Component({
  components: {
    ScrollView,
    Heading,
    FormattedToken,
    LoadingIndicator,
    Elide,
    Icon,
    Identicon,
  },
})
export default class AccountHistory extends Vue {
  transactions: Transaction[] = [];
  state: 'initial' | 'loading' | 'loaded' | 'error' = 'initial';

  get address(): string {
    return this.$route.params.address;
  }

  formatTimestamp(ts: number): string {
    // @ts-ignore
    const rtf = new Intl.RelativeTimeFormat('en');
    const diff = +new Date(ts) - + new Date();
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    if ((-diff) < 60 * 1000) return 'a moment ago';
    if ((-diff) < millisecondsPerDay/60) return rtf.format(Math.round(diff/(millisecondsPerDay * 60)), 'minute');
    if ((-diff) < millisecondsPerDay) return rtf.format(Math.round(diff/(millisecondsPerDay / 24)), 'hour');
    return rtf.format(Math.round(diff/millisecondsPerDay), 'day');
  }

  async reload() {
    if (!this.transactions.length) this.state = 'loading';
    try {
      this.transactions = await timedAsync(
        this.$background.getAccountTx({ address: this.$route.params.address, chainId: this.$route.params.chainId }),
        { fastTime: 1000 } as any,
      );
      this.state = 'loaded';
      setTimeout(() => this.reload(), 10*1000);
    } catch(e) {
      this.state = 'error';
      console.error(e);
    }
  }

  mounted() {
    this.reload();
  }

  goToExplorer(tx: Transaction): void {
    const url = getExplorerUrl(this.$route.params.chainId, `/transaction/${tx.data.hash}`);
    if (url) window.open(url);
  } 


  getCategory(tx: Transaction): string {
    return TxTypes[tx.data.type];
  }
}
</script>

<style lang="scss">
.tx-history-page {
  background-color: #fafafa;
  header {
    background-color: #fff;
  }
  main {
    margin: 12px 0;
  }
  .section-heading {
    margin: 0;
  }
}
.tx-list {
  padding-left: 20px;
  min-height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .loading-indicator, .empty-state {
    margin: auto;
  }
  .empty-state {
    color: #666;
  }

  .tx-list-item {
    background-color: #fff;
    border-bottom: 1px solid #eee;
    display: flex;
    cursor: pointer;
    font-size: (12/16)*1rem;
    padding: 12px 8px;
  
    &:last-child {
      border-bottom: 0;
    }
    .tx-direction {
      margin-right: 8px;
    }
    .tx-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .address-amount, .date-category {
      display: flex;
      align-items: center;
      > :last-child {
        margin-left: auto;
      }
    }
    .address {
      overflow: hidden;
      margin-right: 1em;
      font-weight: 500;

      display: flex;
      align-items: center;

      .identicon {
        width: 28px;
        height: 28px;
        margin-top: -2px;
        margin-right: 5px;
        flex-shrink: 0;
      }
    }
    .amount {
      white-space: nowrap;
      font-weight: 500;
      &.negative {
        color: #f3a354;
      }
      &.positive {
        color: #00c789;
      }
    }
    .date-category {
      margin-top: 0.4em;
      color: #666;
    }
  }
}
</style>