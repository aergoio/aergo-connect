import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Welcome from '../views/Welcome.vue';
import Create from '../views/Create.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/new/create',
    name: 'Create',
    component: Create,
    meta: { transitionName: 'slide', },
  }
];

const router = new VueRouter({
  routes,
});

export default router;
