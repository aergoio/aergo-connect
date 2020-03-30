<template>
  <div class="identicon"></div>
</template>

<script>
import jdenticon from "jdenticon";
import Vue from 'vue';
import { Address } from '@herajs/common';

const emptySvg = `
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="16" y="16" width="168" height="168" fill="#F0F0F0"/>
</svg>
`;
const invalidSvg = `
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="16" y="16" width="168" height="168" fill="#F0F0F0"/>
<path d="M142.5 100C142.5 123.472 123.472 142.5 100 142.5C76.5279 142.5 57.5 123.472 57.5 100C57.5 76.5279 76.5279 57.5 100 57.5C123.472 57.5 142.5 76.5279 142.5 100Z" stroke="#EE4648" stroke-width="3"/>
<path d="M105.321 118.392C105.321 115.342 103.102 112.894 99.9734 112.894C96.8977 112.894 94.6788 115.342 94.6788 118.392C94.6788 121.492 96.8977 123.946 99.9734 123.946C103.102 123.946 105.321 121.492 105.321 118.392ZM96.4508 105.523H103.549L104.257 83.4203V76.0545H95.743V83.4203L96.4508 105.523Z" fill="#EE4648"/>
</svg>
`;

export default Vue.extend({
  props: ['text'],
  data () {
    return {
    }
  },
  watch: {
    text() {
      this.load();
    }
  },
  methods: {
    load() {  
      if (this.text) {
        try {
          const address = new Address(this.text);
          this.$el.innerHTML = jdenticon.toSvg(`${address}`, 200);
        } catch (e) {
          this.$el.innerHTML = invalidSvg;
        }
      } else {
        this.$el.innerHTML = emptySvg;
      }
    }
  },
  mounted() {
    this.load();
  },
});
</script>

<style lang="scss">
.identicon {
  width: 36px;
  height: 36px;

  svg {
    width: 100%;
    height: auto;
  }
  &.circle {
    border-radius: 100%;
    padding: 3px;
    border: 1px solid #f2f2f2;
    box-sizing: border-box;
  }
}
</style>
