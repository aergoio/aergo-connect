import { VueConstructor } from 'vue';
import backgroundStore from '../background/store';

export default class IndexedDb {
  static install(Vue: VueConstructor) {
    Vue.prototype.$db = backgroundStore;
  }
}