<template>
  <ScrollView class="page send-page">
    <div class="content">
      <Heading tag="h2" style="margin-top: 0">Send</Heading>
      <AddressField label="Recipient" v-model="txBody.to" :error="errors.to" />
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
        <p class="note">Enter any text (e.g. ascii, utf8, json).</p>
        <TextField label="Gas limit" type="number" v-model="txBody.limit" :error="errors.limit" />
        <p class="note">Use a gas limit of 0 to use as much gas as available.</p>
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
import { TextField, AddressField, SelectField } from '@aergo-connect/lib-ui/src/forms';
import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { PersistInputsMixin } from '../../../store/ui';

import Component, { mixins } from 'vue-class-component';
import { Tx } from '@herajs/client';
import { Address } from '@herajs/common';
import { capitalizeFirstLetter } from '../../../utils/strings';
import { parsePayload } from '../../../utils/payload';

const typeOptions: [number, string][] = [];
export function keys<O>(o: O): (keyof O)[] {
    return Object.keys(o) as (keyof O)[];
}
/**
 * This functions takes an object,
 * gets the keys, excluding some, orders some of the keys to the beginning, and returns
 * a typed tuple of the remaining keys.
 */
function keysFilteredReordered<O, E extends Partial<O>>(
  enumObj: O,
  orderFront: (keyof O)[],
  exclude: (keyof E)[] = []
): Exclude<keyof O, keyof E>[] {
  const filtered = keys(enumObj).filter(a => exclude.indexOf(a) === -1);
  return Array.from(new Set([...orderFront, ...filtered])) as Exclude<(keyof O), (keyof E)>[];
}
const orderedTypes = keysFilteredReordered(Tx.Type, ['TRANSFER', 'CALL', 'GOVERNANCE'], ['DEPLOY', 'REDEPLOY']);
for (const key of orderedTypes) {
  typeOptions.push([Tx.Type[key], capitalizeFirstLetter(key.toLowerCase())]);
}

@Component({
  components: {
    ScrollView,
    Heading,
    TextField,
    AddressField,
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
    type: Tx.Type.TRANSFER,
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
    } else {
      try {
        new Address(this.txBody.to);
        this.errors.to = '';
      } catch (e) {
        this.errors.to = 'Invalid address';
      }
    }
    if (!this.txBody.amount) {
      this.errors.amount = 'Required';
    } else {
      this.errors.amount =  '';
    }
    if (this.errors.to || this.errors.amount) return;
    if (this.txBody.payload) {
      try {
        // Reparse JSON to make sure it can be read by Ledger
        const json = JSON.parse(this.txBody.payload);
        this.txBody.payload = JSON.stringify(json);
      } catch (e) {
        // Ignore
      }
    }
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