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
        <div style="padding-left: 20px">
          <TxConfirm :txBody="txData" v-if="txData" />
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

import { PersistInputsMixin } from '../../../store/ui';
import Component, { mixins } from 'vue-class-component';

import TxConfirm from '../../../components/account/TxConfirm.vue';

@Component({
  components: {
    ScrollView,
    Heading,
    Button,
    ButtonGroup,
    InvertedColors,
    SuccessIcon,
    TxConfirm,
  },
})
export default class AccountSendConfirm extends mixins(PersistInputsMixin) {
  persistFields = ['txBody'];
  persistFieldsKey = 'send';
  persistInitialValues = false;
  txBody: any = {};
  txData: any = null;

  mounted() {
    this.$background.getTransaction(this.$route.params.chainId, this.$route.params.hash).then(result => {
      this.txData = result.tx;
      this.txData.payload = Buffer.from(Object.values(this.txData.payload)).toString();
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
</style>