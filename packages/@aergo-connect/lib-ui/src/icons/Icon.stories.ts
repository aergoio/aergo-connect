import { storiesOf } from '@storybook/vue';
import { text, boolean, number } from '@storybook/addon-knobs';
import Icon from './Icon.vue';
import { IconName, iconNames } from './types';

const IconStory = (name: IconName) => {
  return `
    <Icon name="${name}" :size="size" :badge="badge" :badgeText="badgeText" /> ${name}<br>
  `;
};

storiesOf('Icons/Icon', module)
  .addParameters({
    backgrounds: [
      { name: 'light', value: '#fafafa', default: true },
      { name: 'dark', value: '#222222' },
    ],
  })
  .add('All Icons', () => ({
    props: {
      size: {
        default: number('Size', 32),
      },
      badge: {
        default: boolean('Badge', false),
      },
      badgeText: {
        default: text('Badge Text', '9'),
      },
    },
    components: { Icon },
    template: `
      <div style="padding: 10px; font-size: 12px">
        ${iconNames.map((name: IconName) => `${IconStory(name)}`).join('')}
      </div>
    `,
  }));
