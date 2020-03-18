import { storiesOf } from '@storybook/vue';
import { number, text } from '@storybook/addon-knobs';
import Identicon from './Identicon.vue';

storiesOf('Content/Identicon', module)
  .add('basic', () => ({
    components: { Identicon },
    props: {
      text: {
        default: text('Text', 'AmhJX1FYQKqNuhwBACW7fkxcTHdMakAfMQobuD5QNXJwT1ZgriAc'),
      },
    },
    template: '<Identicon :text="text" />',
  }));
