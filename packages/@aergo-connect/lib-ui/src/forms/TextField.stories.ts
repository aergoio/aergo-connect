import { storiesOf } from '@storybook/vue';
import TextField from './TextField.vue';
import { boolean, select, text } from '@storybook/addon-knobs';
import { InputVariants, InputTypes, InputStates } from './types';

storiesOf('Forms/TextField', module)
  .add('with options', () => ({
    components: { TextField },
    template: `
    <div style="max-width: 400px">
      <TextField :type="type" :variant="variant" :state="state" :disabled="disabled" :error="error" v-model="value" />
    </div>`,
    data: () => {
      return {
        value: '',
      };
    },
    props: {
      variant: {
        type: String,
        default: select('Variant', InputVariants, InputVariants[0]),
      },
      type: {
        type: String,
        default: select('Type', InputTypes, InputTypes[0]),
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