import { storiesOf } from '@storybook/vue';
import SuccessIcon from './SuccessIcon.vue';
import InvertedColors from '../theme/InvertedColors.vue';

storiesOf('Icons/SuccessIcon', module)
  .add('basic', () => ({
    components: { SuccessIcon },
    template: '<SuccessIcon />',
  }))
  .add('inverted colors', () => ({
    components: { SuccessIcon, InvertedColors },
    template: '<InvertedColors style="background: #111; padding: 20px;"><SuccessIcon /></InvertedColors>',
  }));