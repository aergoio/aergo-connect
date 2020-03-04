import { storiesOf } from '@storybook/vue';
import Button from './Button.vue';
import { boolean, select } from '@storybook/addon-knobs';
import { ButtonTypes, ButtonSizes } from './types';

storiesOf('Buttons/Button', module)
  .add('with options', () => ({
    components: { Button },
    template: '<Button :size="size" :type="type" :loading="loading" :disabled="disabled">Continue</Button>',
    props: {
      type: {
        type: String,
        default: select('Type', ButtonTypes, ButtonTypes[0]),
      },
      size: {
        type: String,
        default: select('Size', ButtonSizes, ButtonSizes[0]),
      },
      disabled: {
        type: Boolean,
        default: boolean('Disabled', false),
      },
      loading: {
        type: Boolean,
        default: boolean('Loading', false),
      },
    }
  }));