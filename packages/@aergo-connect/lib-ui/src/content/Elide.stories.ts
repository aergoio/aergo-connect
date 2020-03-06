import { storiesOf } from '@storybook/vue';
import Elide from './Elide.vue';
import { text, select, number, boolean } from '@storybook/addon-knobs';

storiesOf('Content/Elide', module)
  .add('with options', () => ({
    components: { Elide },
    template: `
    <div style="max-width: 200px;">
      <Elide :mode="mode" :text="text" :fixed="fixed" :expectEllipsis="expectEllipsis" />
    </div>`,
    props: {
      mode: {
        type: String,
        default: select('Mode', ['head', 'tail', 'middle-fixed-head', 'middle-fixed-tail'], 'tail'),
      },
      text: {
        type: String,
        default: text('Text', 'AmPvLtKbFpTT9zjSJat9kSVCmQwZoqV3VkbDB934VQsCdLAJACnU'),
      },
      fixed: {
        type: Number,
        default: number('Fixed number of chars', 4),
      },
      expectEllipsis: {
        type: Boolean,
        default: boolean('Expect ellipsis?', false),
      },
    }
  }));