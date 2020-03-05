<template>
  <transition appear name="appear">
    <div :style="`transition-delay: ${delay}s`">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    delay: {
      type: Number,
      default: 0,
    },
  },
});
</script>

<style lang="scss">
.appear-enter-active, .appear-leave-active {
  transition: opacity .6s;
}
.appear-enter, .appear-leave-to {
  opacity: 0;
}
</style>