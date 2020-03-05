<template>
  <component :is="tag" class="section-heading" :class="{'is-animated': animated}">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    tag: {
      type: String,
      default: 'h1',
    },
    animated: Boolean,
  },
});
</script>

<style lang="scss">
.section-heading {
  &h1 {
    font-size: 2rem;
    font-weight: 500;
    margin: 0 0 .4em;
  }
  &.is-animated {
    animation: heading-appear .5s forwards .3s;
    opacity: 0;
  }
}
@keyframes heading-appear {
    0%   { transform: translateX(10px); opacity: 0.25; }
    100% { transform: translateX(0px); opacity: 1.0; }
}
</style>