import Vue from 'vue';

export default Vue.extend({
  functional: true,
  name: 'kv-table-row',
  props: {
    label: {
      type: String,
      required: true,
    },
    textEllipsis: Boolean,
  },
  render(createElement, { props, children }) {
    const ddData = {} as any;
    if (props.textEllipsis) {
      ddData.class = { textEllipsis: props.textEllipsis };
    }
    return [
      createElement('dt', {}, [props.label]),
      createElement('dd', ddData, children),
    ];
  },
});
