import { storiesOf } from '@storybook/vue';
import PasswordStrengthField from './PasswordStrengthField.vue';
import { select } from '@storybook/addon-knobs';
import { InputVariants } from './types';

storiesOf('Forms/PasswordStrengthField', module)
  .add('with options', () => ({
    components: { PasswordStrengthField },
    template: `
    <div style="max-width: 360px">
      <p>Please enter a good passphrase.</p>
      <PasswordStrengthField :variant="variant" v-model="password" />
      <p>Value: {{password}}</p>
    </div>`,
    data: () => {
      return {
        password: '',
      };
    },
    props: {
      variant: {
        type: String,
        default: select('Variant', InputVariants, 'main'),
      },
    }
  }));