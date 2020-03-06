import { storiesOf } from '@storybook/vue';
import ScrollView from './ScrollView.vue';
import Header from './Header.vue';
import HeaderLogo from '../icons/HeaderLogo.vue';
//import InvertedColors from '../theme/InvertedColors.vue';

storiesOf('Layouts/Header', module)
  .add('basic', () => ({
    components: { ScrollView, Header, HeaderLogo },
    template: `
      <div style="width: 360px; height: 400px; border-radius: 8px; box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0.08);">
        <ScrollView>
          <template #header>
            <Header>
                <HeaderLogo />
            </Header>
          </template>

          <div style="padding: 16px">
            Scroll view content
            <div style="height: 545px"></div>
            Hello
          </div>
        </ScrollView>
      </div>
`,
  }));