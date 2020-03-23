import { storiesOf } from '@storybook/vue';
import SwitchButton from './SwitchButton.vue';
import { boolean, } from '@storybook/addon-knobs';

storiesOf('Forms/Switch button', module)
  .add('basic', () => ({
    components: { SwitchButton },
    template: `
      <div>
        <p>Selected value is <strong>{{someOption}}</strong>.</p>
        <SwitchButton v-model="someOption" :disabled="disabled" :label="someOption ? 'Turn it off' : 'Turn it on'" />
      </div>
    `,
    data: () => ({
      someOption: true,
    }),
    props: {
      disabled: {
        type: Boolean,
        default: boolean('Disabled', false),
      },
    },
  }));
