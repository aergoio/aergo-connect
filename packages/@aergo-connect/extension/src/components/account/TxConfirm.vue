<template>
  <div class="data-box">
    <KVTable>
      <KVTableRow label="Hash" v-if="txBody.hash">
        <a v-if="explorerUrl" :href="explorerUrl" target="_blank" class="text-link-alternative">{{txBody.hash}}</a>
        <span v-else>{{txBody.hash}}</span>
      </KVTableRow>
      <KVTableRow label="Recipient"><span class="empty" v-if="!txBody.to">(Empty)</span><span v-else>{{txBody.to}}</span></KVTableRow>
      <KVTableRow label="Amount" v-if="!keys.length || keys.indexOf('amount') !== -1"><FormattedToken :value="amountValue" /></KVTableRow>
      <KVTableRow label="Fee" v-if="txBody.fee && (!keys.length || keys.indexOf('fee') !== -1)"><FormattedToken :value="txBody.fee" /></KVTableRow>
      <KVTableRow label="Type" v-if="!keys.length || keys.indexOf('type') !== -1">{{typeLabel}}</KVTableRow>
      <KVTableRow label="Gas limit" v-if="!keys.length || keys.indexOf('limit') !== -1">{{txBody.limit || 0}}</KVTableRow>
      <KVTableRow label="Payload" v-if="!keys.length || keys.indexOf('payload') !== -1"><div class="payload" v-html="formattedPayload"></div></KVTableRow>
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
import { jsonHighlight } from '../../utils/json';

@Component({
  components: {
    KVTable, KVTableRow, FormattedToken,
  },
})
export default class TxConfirm extends Vue {
  @Prop({type: Object, required: true}) readonly txBody!: any;
  @Prop({type: Array, default: () => ([])}) readonly keys!: any;

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
  get formattedPayload(): string {
    const payload = `${this.txBody.payload}`;
    try {
      // If it is parsable as json, use json highlighter
      JSON.parse(payload);
      return jsonHighlight(payload);
    } catch {
      return `<span class="string">${payload}</span>`;
    }
  }
}
</script>
<style lang="scss">
.data-box {
  .formatted-value {
    font-weight: 500;
  }
  .empty {
    color: #888;
  }
  .payload {
    font-family: monospace;
    white-space: pre-wrap;
    text-align: left;
    color: #777;
    
    .string, .boolean, .number, .null {
      font-weight: 500;
    }
    .key {
      color: #0082c7;
    }
    .string {
      color: #000;
    }
    .boolean, .number, .null {
      color: #259603;
    }
  }
}
</style>