import { storiesOf } from '@storybook/vue';
import Button from './Button.vue';

storiesOf('Button', module)
  .add('with text', () => ({
    components: { Button },
    template: '<Button>with text</Button>',
  }))
  .add('with emoji', () => ({
    components: { Button },
    template: '<Button>😀 😎 👍 💯</Button>',
  }))
  .add('as a component', () => ({
    components: { Button },
    template: '<Button :rounded="true">rounded</Button>',
  }));