import { storiesOf } from '@storybook/vue';
import AddressField from './AddressField.vue';
import { boolean, select, text } from '@storybook/addon-knobs';
import { InputVariants, InputStates } from './types';
import { Address } from '@herajs/common';

storiesOf('Forms/AddressField', module)
  .add('with options', () => ({
    components: { AddressField },
    template: `
    <div style="max-width: 360px">
      <AddressField :variant="variant" :state="state" :disabled="disabled" :error="error" v-model="value" :error="error" />
    </div>`,
    data: () => {
      return {
        value: 'AmPKxbJP5UCzT6YFb5MPmVEFLvreXJ3WBE3rrBXp1EBRLYBEJwDb',
        error: '',
      };
    },
    computed: {
      error() {
        try {
          // @ts-ignore
          new Address(this.value as string);
          return '';
        } catch (e) {
          return 'Invalid address';
        }
      },
    },
    props: {
      variant: {
        type: String,
        default: select('Variant', InputVariants, InputVariants[0]),
      },
      state: {
        type: String,
        default: select('State', InputStates, InputStates[0]),
      },
      disabled: {
        type: Boolean,
        default: boolean('Disabled', false),
      },
    }
  }));