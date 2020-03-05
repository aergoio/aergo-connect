import StoryRouter from 'storybook-vue-router';
import { storiesOf } from '@storybook/vue';
import TabBar from './TabBar.vue';
import Icon from '../icons/Icon.vue';

const Home = {
  template: '<div>Home</div>'
};
const About = {
  template: '<div>About</div>'
};
const History = {
  template: '<div>History</div>'
};

storiesOf('Navigation/TabBar', module)
  .addDecorator(StoryRouter({}, {
    initialEntry: '/home',
    routes: [
      { path: '/home', component: Home },
      { path: '/about', component: About },
      { path: '/History', component: History }
    ]}))
  .add('basic', () => ({
    components: { TabBar },
    template: `
      <div style="width: 401px; margin: 10px auto; box-shadow: 0 3px 6px rgba(0,0,0,0.15);">
        <TabBar>
          <router-link to="/home">Home</router-link>
          <router-link to="/about">About</router-link>
          <router-link to="/history">History</router-link>
        </TabBar>
        <div style="padding: 20px;">
          <router-view/>
        </div>
      </div>
`,
  }))
  .add('with icons', () => ({
    components: { TabBar, Icon },
    template: `
      <div style="width: 401px; margin: 10px auto; box-shadow: 0 3px 6px rgba(0,0,0,0.15);">
        <TabBar>
          <router-link to="/home"><Icon name="tab-wallet" :size="32" /></router-link>
          <router-link to="/about"><Icon name="tab-send" :size="32" /></router-link>
          <router-link to="/history"><Icon name="tab-history" :size="32" /></router-link>
        </TabBar>
        <div style="padding: 20px;">
          <router-view/>
        </div>
      </div>
`,
  }));