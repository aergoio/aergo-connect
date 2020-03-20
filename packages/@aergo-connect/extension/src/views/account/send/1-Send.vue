<template>
  <ScrollView class="page">
    <div class="content">
      <Heading tag="h2">Send</Heading>
      <TextField label="Recipient" v-model="txBody.to" :error="errors.to" />
      <div class="amount-unit">
        <TextField label="Amount" type="number" variant="main" v-model="txBody.amount" :error="errors.amount" />
        <SelectField variant="main" modal-sheet v-model="txBody.unit" :options="unitOptions" dropdownTitle="Unit" />
      </div>
      <TextField label="Message (optional)" v-model="txBody.payload" :error="errors.payload" />
    </div>
    <template #footer>
      <div class="content">
        <ButtonGroup vertical>
          <Button type="primary" @click="checkData">Check Data</Button>
        </ButtonGroup>
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { TextField, SelectField } from '@aergo-connect/lib-ui/src/forms';
import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { PersistInputsMixin } from '../../../store/ui';

import Component, { mixins } from 'vue-class-component';

@Component({
  components: {
    ScrollView,
    Heading,
    TextField,
    SelectField,
    Button,
    ButtonGroup,
  },
})
export default class AccountSend extends mixins(PersistInputsMixin) {
  persistFields = ['txBody'];
  persistFieldsKey = 'send';
  persistInitialValues = false;

  txBody: any = {
    to: '',
    amount: '',
    unit: 'aergo',
    payload: '',
  };
  errors: any = {
    to: '',
    amount: '',
    unit: '',
    payload: '',
  };

  unitOptions = ['aergo', 'aer'];

  checkData() {
    if (!this.txBody.to) {
      this.errors.to = 'Required';
    }
    if (!this.txBody.amount) {
      this.errors.amount = 'Required';
    }
    if (this.errors.to || this.errors.amount) return;
    this.$router.push({ name: 'account-send-confirm' });
  }
}
</script>

<style lang="scss">
.amount-unit {
  display: flex;
  margin-bottom: 15px;
  > div {
    flex: 1;
    &:last-child {
      margin-left: 8px;
      flex: 0 90px;
    }
  }
  .select-container {
    margin-top: 21px;
  }
}
</style>