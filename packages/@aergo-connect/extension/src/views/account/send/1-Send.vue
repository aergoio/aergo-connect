<template>
  <ScrollView class="page">
    <div class="content">
      <Heading tag="h2">Send</Heading>
      <TextField label="Recipient" v-model="txBody.to" :error="errors.to" />
      <div class="amount-unit">
        <TextField label="Amount" type="number" variant="main" v-model="txBody.amount" :error="errors.amount" />
        <SelectField variant="main" modal-sheet v-model="txBody.unit" :options="unitOptions" dropdownTitle="Unit" />
      </div>
      <p>
        <span class="text-link optional-fields-toggle" @click="showExtraFields=!showExtraFields">{{showExtraFields?'Hide':'Show'}} optional fields</span>
      </p>
      <div v-if="showExtraFields">
        <SelectField label="Type" modal-sheet v-model="txBody.type" :options="typeOptions" dropdownTitle="Type" />
        <TextField label="Message" v-model="txBody.payload" :error="errors.payload" />
        <TextField label="Gas limit" type="number" v-model="txBody.limit" :error="errors.limit" />
      </div>
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
import { Tx } from '@herajs/client';
import { capitalizeFirstLetter } from '../../../utils/strings';

const typeOptions: [number, string][] = [];
export function keys<O>(o: O): (keyof O)[] {
    return Object.keys(o) as (keyof O)[];
}
for (const key of keys(Tx.Type)) {
  typeOptions.push([Tx.Type[key], capitalizeFirstLetter(key.toLowerCase())]);
}
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
  persistFields = ['txBody', 'showExtraFields'];
  persistFieldsKey = 'send';
  persistInitialValues = false;

  showExtraFields = false;
  txBody: any = {
    to: '',
    amount: '0',
    unit: 'aergo',
    payload: '',
    limit: 0,
    type: 0,
  };

  errors: any = {
    to: '',
    amount: '',
    unit: '',
    payload: '',
    limit: '',
  };

  unitOptions = ['aergo', 'aer'];
  typeOptions = typeOptions;

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
.optional-fields-toggle {
  font-size: .9em;
  cursor: pointer;
}
</style>