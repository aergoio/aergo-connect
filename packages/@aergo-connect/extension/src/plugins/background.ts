import Vue, { VueConstructor } from 'vue';
import { ApiMethods } from '../background/api';

export default class Background {
  static install(Vue: VueConstructor, { background }: any) {
    Vue.prototype.$background = background;
    Vue.prototype.$setBackground = (background: any) => {
      Vue.prototype.$background = background;
    };
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $background: ApiMethods & NodeJS.EventEmitter;
    $setBackground(background: any): void;
  }
}