

import Vue from 'vue'
import { formatToken } from './format';

export default Vue.extend({
  functional: true,
  props: {
    value: {
      type: String,
      required: true,
    },
    unit: String,
  },
  render(h, ctx) {
    const innerHTML = formatToken(ctx.props.value, ctx.props.unit);
    return h('span', { ...ctx.data, domProps: { innerHTML } })
  }
})