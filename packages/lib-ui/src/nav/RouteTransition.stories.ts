import StoryRouter from 'storybook-vue-router';
import { storiesOf } from '@storybook/vue';
import RouteTransition from './RouteTransition.vue';

const List = {
  template: `<div>
  List<br>
  <router-link to="/list/detail">View detail &raquo;</router-link> (slide based on path)<br>
  <router-link to="/list2">View list 2 &raquo;</router-link> (slide based on index)<br>
  <router-link to="/list3">View list 3 &raquo;</router-link> (fade)<br>
  </div>`,
};
const Detail = {
  template: '<div><router-link to="/list">&laquo; Back to list</router-link></div>'
};

storiesOf('Navigation/RouteTransition', module)
  .addDecorator(StoryRouter({}, {
    initialEntry: '/list',
    routes: [
      { path: '/list', component: List, meta: { transitionName: 'slide', index: 0 } },
      { path: '/list/detail', component: Detail, meta: { transitionName: 'slide' } },
      { path: '/list2', component: Detail, meta: { transitionName: 'slide', index: 1 } },
      { path: '/list3', component: Detail, meta: { transitionName: 'fade' } },
    ]}))
  .add('slide based on path', () => ({
    components: { RouteTransition },
    template: `
      <div style="width: 400px; height: 200px; overflow: hidden; margin: 10px auto; border: 1px solid #eee; position: relative">
        <RouteTransition>
          <router-view/>
        </RouteTransition>
      </div>
`,
  }));