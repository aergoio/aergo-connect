import Vue, { VueConstructor } from 'vue';
import { Api } from '../background/api';

export default class Background {
  static install(Vue: VueConstructor, { background }: any) {
    Vue.prototype.$background = background;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $background: Api;
  }
}