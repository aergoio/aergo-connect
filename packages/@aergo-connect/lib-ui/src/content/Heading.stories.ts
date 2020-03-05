import { storiesOf } from '@storybook/vue';
import Heading from './Heading.vue';
import { text, boolean } from '@storybook/addon-knobs';

storiesOf('Content/Heading', module)
  .add('with options', () => ({
    components: { Heading },
    template: `
    <div>
      <Heading :tag="tag" :animated="animated">{{text}}</Heading>
    </div>`,
    props: {
      tag: {
        type: String,
        default: text('Tag', 'h1'),
      },
      text: {
        type: String,
        default: text('Text', 'Create'),
      },
      animated: {
        type: Boolean,
        default: boolean('Animated', false),
      }
    }
  }));