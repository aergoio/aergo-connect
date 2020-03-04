import StoryRouter from 'storybook-vue-router';
import { storiesOf } from '@storybook/vue';
import TabBar from './TabBar.vue';

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
      <div style="width: 400px; margin: 10px auto; border: 1px solid #eee;">
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
  }));