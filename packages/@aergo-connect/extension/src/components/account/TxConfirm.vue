<template>
  <div class="data-box">
    <KVTable>
      <KVTableRow label="Hash" v-if="txBody.hash">
        <a v-if="explorerUrl" :href="explorerUrl" target="_blank" class="text-link-alternative">{{txBody.hash}}</a>
        <span v-else>{{txBody.hash}}</span>
      </KVTableRow>
      <KVTableRow label="Recipient">{{txBody.to}}</KVTableRow>
      <KVTableRow label="Amount" v-if="!keys.length || keys.indexOf('amount') !== -1"><FormattedToken :value="amountValue" /></KVTableRow>
      <KVTableRow label="Fee" v-if="txBody.fee && (!keys.length || keys.indexOf('fee') !== -1)"><FormattedToken :value="txBody.fee" /></KVTableRow>
      <KVTableRow label="Type" v-if="!keys.length || keys.indexOf('type') !== -1">{{typeLabel}}</KVTableRow>
      <KVTableRow label="Gas limit" v-if="!keys.length || keys.indexOf('limit') !== -1">{{txBody.limit}}</KVTableRow>
      <KVTableRow label="Payload" v-if="!keys.length || keys.indexOf('payload') !== -1">{{txBody.payload}}</KVTableRow>
    </KVTable>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
// @ts-ignore
import { TxTypes } from '@herajs/common';

import { KVTable, KVTableRow } from '@aergo-connect/lib-ui/src/tables';
import { FormattedToken } from '@aergo-connect/lib-ui/src/content';

import { getExplorerUrl } from '../../utils/chain-urls';

@Component({
  components: {
    KVTable, KVTableRow, FormattedToken,
  },
})
export default class TxConfirm extends Vue {
  @Prop({type: Object, required: true}) readonly txBody!: any;
  @Prop({type: Array, default: []}) readonly keys!: any;

  get typeLabel(): string {
    return TxTypes[this.txBody.type || 0];
  }
  get amountValue(): string {
    if (this.txBody.unit) return `${this.txBody.amount} ${this.txBody.unit}`;
    return `${this.txBody.amount}`;
  }
  get explorerUrl(): string {
    return getExplorerUrl(this.$route.params.chainId, `transaction/${this.$route.params.hash}`);
  }
}
</script>
<style lang="scss">
.data-box {
  .formatted-value {
    font-weight: 500;
  }
}
</style>