import { storiesOf } from '@storybook/vue';
import ContinueButton from './ContinueButton.vue';
import { boolean } from '@storybook/addon-knobs';

storiesOf('Buttons/ContinueButton', module)
  .add('with options', () => ({
    components: { ContinueButton },
    template: '<ContinueButton :loading="loading" :disabled="disabled" />',
    props: {
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