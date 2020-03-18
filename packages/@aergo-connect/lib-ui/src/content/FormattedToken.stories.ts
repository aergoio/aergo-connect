import { storiesOf } from '@storybook/vue';
import FormattedToken from './FormattedToken';
import { text, select } from '@storybook/addon-knobs';

storiesOf('Content/FormattedToken', module)
  .add('with options', () => ({
    components: { FormattedToken },
    template: `<FormattedToken :value="value" :unit="unit" />`,
    props: {
      value: {
        type: String,
        default: text('Value', '123 aergo'),
      },
      unit: {
        type: String,
        default: select('Unit', ['', 'aergo', 'gaer', 'aer'], '')
      },
    }
  }));