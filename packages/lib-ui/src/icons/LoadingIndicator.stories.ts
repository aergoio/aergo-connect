import { storiesOf } from '@storybook/vue';
import { select } from '@storybook/addon-knobs';
import LoadingIndicator from './LoadingIndicator.vue';

storiesOf('Icons/Loading indicator', module)
  .add('Basic', () => ({
    components: { LoadingIndicator },
    props: {
      size: {
        default: select('size', [20, 30, 45], 20),
      },
      type: {
        default: select('type', ['typing', 'spinner'], 'spinner'),
      },
    },
    template: `<LoadingIndicator :type="type" :size="size" />`,
  }));
