import { storiesOf } from '@storybook/vue';
import SelectField from './SelectField.vue';
import { boolean, select, text } from '@storybook/addon-knobs';
import { InputVariants, InputStates } from './types';

storiesOf('Forms/SelectField', module)
  .add('with options', () => ({
    components: { SelectField },
    template: `
    <div style="max-width: 400px">
      <SelectField :variant="variant" :state="state" :disabled="disabled" :error="error" :options="options" v-model="value" />
    </div>`,
    data: () => {
      return {
        value: 'aergo.io',
        options: ['aergo.io', 'testnet.aergo.io'],
      };
    },
    props: {
      variant: {
        type: String,
        default: select('Variant', InputVariants, InputVariants[1]),
      },
      state: {
        type: String,
        default: select('State', InputStates, InputStates[0]),
      },
      disabled: {
        type: Boolean,
        default: boolean('Disabled', false),
      },
      error: {
        type: String,
        default: text('Error', ''),
      }
    }
  }));