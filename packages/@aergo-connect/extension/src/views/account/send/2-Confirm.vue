<template>
  <ScrollView class="page">
    <template #header>
      <div class="content" style="padding-bottom: 0;">
        <BackButton :to="{ name: 'account-send' }" />
        <Heading tag="h2">Confirmation</Heading>
        {{error}}
      </div>
    </template>
    <div class="content" style="padding-top: 0;">
      <TxConfirm :txBody="txBody" />
    </div>
    <template #footer>
      <div class="content">
        <ButtonGroup vertical>
          <Button type="primary" @click="confirm">Confirm</Button>
        </ButtonGroup>
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { BackButton, Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';

import { PersistInputsMixin } from '../../../store/ui';
import TxConfirm from '../../../components/account/TxConfirm.vue';

import Component, { mixins } from 'vue-class-component';
@Component({
  components: {
    ScrollView,
    BackButton,
    Heading,
    Button,
    ButtonGroup,
    TxConfirm,
  },
})
export default class AccountSendConfirm extends mixins(PersistInputsMixin) {
  persistFields = ['txBody'];
  persistFieldsKey = 'send';
  persistInitialValues = false;

  txBody: any = {};
  error = null;

  async confirm() {
    const txBody = {
      ...this.txBody,
      amount: `${this.txBody.amount} ${this.txBody.unit}`,
      from: this.$route.params.address,
    };
    try {
      const result = await this.$background.sendTransaction(txBody, this.$route.params.chainId);
      if ('tx' in result) {
        const hash = result.tx.hash;
        if (hash) {
          this.$router.push({ name: 'account-send-success', params: { hash }});
        }
      }
    } catch(e) {
      this.error = e;
      console.log(e);
    }
  }
}
</script>

<style lang="scss">
.data-box {
  border-radius: 2px;
  box-shadow: 0 12px 20px 0 rgba(34, 34, 34, 0.08);
  padding: 20px;
}
</style>