import { storiesOf } from '@storybook/vue';
import SuccessIcon from './SuccessIcon.vue';
import InvertedColors from '../theme/InvertedColors.vue';

storiesOf('Icons/SuccessIcon', module)
  .add('basic', () => ({
    components: { SuccessIcon },
    template: '<div style="padding: 20px; text-align: center"><SuccessIcon /></div>',
  }))
  .add('inverted colors', () => ({
    components: { SuccessIcon, InvertedColors },
    template: '<InvertedColors style="background: #111; padding: 20px; text-align: center"><SuccessIcon /></InvertedColors>',
  }));