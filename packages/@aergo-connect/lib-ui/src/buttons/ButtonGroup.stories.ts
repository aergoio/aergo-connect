import { storiesOf } from '@storybook/vue';
import Button from './Button.vue';
import ButtonGroup from './ButtonGroup.vue';
import { select } from '@storybook/addon-knobs';

storiesOf('Buttons/ButtonGroup', module)
  .add('with options', () => ({
    components: { Button, ButtonGroup },
    template: `
      <div style="width: 300px">
        <ButtonGroup :horizontal="this.align==='horizontal'" :vertical="this.align==='vertical'">
          <Button type="primary">Continue</Button>
          <Button type="secondary">Cancel</Button>
        </ButtonGroup>
      </div>
    `,
    props: {
      align: {
        type: String,
        default: select('Alignment', ['vertical', 'horizontal'], 'vertical'),
      },
    }
  }));