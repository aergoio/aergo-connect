import { storiesOf } from '@storybook/vue';
import HeaderLogo from './HeaderLogo.vue';


storiesOf('Icons/HeaderLogo', module)
  .addParameters({
    backgrounds: [
      { name: 'light', value: '#fafafa', default: true },
      { name: 'dark', value: '#222222' },
    ],
  })
  .add('Header logo', () => ({
    components: { HeaderLogo },
    template: `
    <HeaderLogo />
    `,
  }));
