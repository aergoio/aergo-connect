<template>
  <InvertedColors class="tx-success-content">
    <ScrollView class="page">
      <ScrollView>
        <template #header>
          <div class="success-header">
            <SuccessIcon />
            <Heading >Transaction sent!</Heading>
          </div>
        </template>
        <div class="success-data-box">
          <KVTable v-if="txData">
            <KVTableRow label="Hash">
              <a v-if="explorerUrl" :href="explorerUrl" target="_blank" class="text-link">{{$route.params.hash}}</a>
              <span v-else>{{$route.params.hash}}</span>
            </KVTableRow>
            <KVTableRow label="Recipient">{{txData.to}}</KVTableRow>
            <KVTableRow label="Amount"><FormattedToken :value="txData.amount" /></KVTableRow>
            <KVTableRow label="Type">{{typeLabel}}</KVTableRow>
            <KVTableRow label="Gas limit">{{txData.limit}}</KVTableRow>
            <KVTableRow label="Nonce">{{txData.nonce}}</KVTableRow>
            <KVTableRow label="Payload">{{txBody.payload}}</KVTableRow>
          </KVTable>
        </div>
      </ScrollView>
      
      <template #footer>
        <div class="footer-button-wrap">
          <ButtonGroup vertical>
            <Button type="secondary" :to="{ name: 'account-send' }">Go back to Send page</Button>
          </ButtonGroup>
        </div>
      </template>
    </ScrollView>
  </InvertedColors>
</template>

<script lang="ts">
import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import InvertedColors from '@aergo-connect/lib-ui/src/theme/InvertedColors.vue'; 
import { SuccessIcon } from '@aergo-connect/lib-ui/src/icons'; 
import { KVTable, KVTableRow } from '@aergo-connect/lib-ui/src/tables';
import { FormattedToken } from '@aergo-connect/lib-ui/src/content';

import { PersistInputsMixin } from '../../../store/ui';
import Component, { mixins } from 'vue-class-component';

import { capitalizeFirstLetter } from '../../../utils/strings';
import { Tx } from '@herajs/client';
import { getExplorerUrl } from '../../../utils/chain-urls';

export function keys<O>(o: O): (keyof O)[] {
    return Object.keys(o) as (keyof O)[];
}

function getTypeLabel(type: typeof Tx.Type[keyof typeof Tx.Type]): string {
  for (const key of keys(Tx.Type)) {
    if (Tx.Type[key] === type) {
      return capitalizeFirstLetter(key.toLowerCase());
    }
  }
  return 'Normal';
}

@Component({
  components: {
    ScrollView,
    Heading,
    Button,
    ButtonGroup,
    InvertedColors,
    SuccessIcon,
    KVTable,
    KVTableRow,
    FormattedToken,
  },
})
export default class AccountSendConfirm extends mixins(PersistInputsMixin) {
  persistFields = ['txBody'];
  persistFieldsKey = 'send';
  persistInitialValues = false;
  txBody: any = {};
  txData: any = null;

  get typeLabel(): string {
    return getTypeLabel(this.txData.type || 0);
  }

  get explorerUrl(): string {
    return getExplorerUrl(this.$route.params.chainId, `transaction/${this.$route.params.hash}`);
  }

  mounted() {
    this.$background.getTransaction(this.$route.params.chainId, this.$route.params.hash).then(result => {
      this.txData = result.tx;
      console.log(result.tx);
    })
  }
}
</script>

<style lang="scss">
.tx-success-content {
  height: 100%;
  main {
    background-color: #1b1b1b;
    color: #fff;
  }
}
.success-header {
  padding: 20px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  .section-heading {
    font-weight: 600;
    margin-top: .3em;
  }
}
.success-data-box {
  padding: 0px 30px 40px 40px;
}
</style>