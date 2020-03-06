import { storiesOf } from '@storybook/vue';
import Appear from './Appear.vue';

storiesOf('Animations/Appear', module)
  .add('with options', () => ({
    components: { Appear },
    template: `
    <div>
      <Appear>
        Content shown immediately
      </Appear>
      
      <Appear :delay="0.5">
        Content shown after 0.5s
      </Appear>

      <Appear :delay="1">
        Content shown after 1s
      </Appear>

      <Appear :delay="1.5">
        Content shown after 1.5s
      </Appear>

      <Appear :delay="2">
        Content shown after 2s
      </Appear>
    </div>`,
  }));