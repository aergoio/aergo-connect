import { storiesOf } from '@storybook/vue';
import ClipboardButton from './ClipboardButton.vue';
import { text } from '@storybook/addon-knobs';
import InvertedColors from '../theme/InvertedColors.vue';

storiesOf('Buttons/ClipboardButton', module)
  .add('with options', () => ({
    components: { ClipboardButton },
    template: '<ClipboardButton :value="value" />',
    props: {
      value: {
        type: String,
        default: text('Value', 'value'),
      },
    }
  }))
  .add('inverted colors', () => ({
    components: { ClipboardButton, InvertedColors },
    template: '<InvertedColors style="background-color: #272727; padding: 30px"><ClipboardButton :value="value" /></InvertedColors>',
    props: {
      value: {
        type: String,
        default: text('Value', 'value'),
      },
    }
  }));