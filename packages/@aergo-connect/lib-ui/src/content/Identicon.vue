<template>
  <div class="identicon">
  </div>
</template>

<script>
import jdenticon from "jdenticon";
import Vue from 'vue';

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
      this.$el.innerHTML = jdenticon.toSvg(this.text, 200);
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
