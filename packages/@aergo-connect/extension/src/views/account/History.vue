<template>
  <ScrollView class="page tx-history-page">
    <template #header>
      <Heading tag="h2">Transaction History</Heading>
      <TransactionFilter :value="filter" :options="filterOptions" @select="setFilter" />
    </template>
    <HistoryList :transactions="filteredTransactions" :address="address" :state="state" />
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import HistoryList from '../../components/account/HistoryList.vue';
import TransactionFilter from '../../components/account/TransactionFilter.vue';
import { capitalizeFirstLetter } from '../../utils/strings';

import Vue from 'vue';
import Component from 'vue-class-component'
import { Transaction } from '@herajs/wallet';
import { timedAsync } from 'timed-async/index.js';

const tuple = <T extends string[]>(...args: T) => args;
const filterOptions = tuple('all', 'received', 'sent');

@Component({
  components: {
    ScrollView,
    Heading,
    HistoryList,
    TransactionFilter,
  },
})
export default class AccountHistory extends Vue {
  transactions: Transaction[] = [];
  state: 'initial' | 'loading' | 'loaded' | 'error' = 'initial';
  filter: typeof filterOptions[number] = 'all';
  filterOptions = filterOptions.map(opt => [opt, capitalizeFirstLetter(opt)]);

  setFilter(filter: typeof filterOptions[number]) {
    this.filter = filter;
  }

  get filteredTransactions() {
    if (this.filter === 'received') {
      return this.transactions.filter((tx) => tx.data.to === this.address && tx.data.from !== this.address);
    }
    if (this.filter === 'sent') {
      return this.transactions.filter((tx) => tx.data.from === this.address && tx.data.to !== this.address);
    }
    return this.transactions;
  }

  get address(): string {
    return this.$route.params.address;
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
    // Clear Send dialog's persisted input
    this.$store.commit('ui/clearInput', { key: 'send' });
  }
}
</script>

<style lang="scss">
.tx-history-page {
  background-color: #fafafa;
  header {
    background-color: #fff;
    .section-heading {
      margin: 20px 20px 0 20px;
    }
  }
  main {
    margin: 12px 0;
  }
  .section-heading {
    margin: 0;
  }
}
.transaction-filter {
  border-bottom: 1px solid #f0f0f0;
  padding-left: 23px;
}
</style>