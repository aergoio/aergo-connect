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
  &.is-animated {
    animation: heading-appear .5s forwards .3s;
    opacity: 0;
  }

  display: flex;
  justify-content: space-between;
  align-items: center;
}
@keyframes heading-appear {
    0%   { transform: translateX(10px); opacity: 0.25; }
    100% { transform: translateX(0px); opacity: 1.0; }
}

.big-title {
  font-size: (44/16)*1rem;
  font-weight: 600;
}
.semi-big-title {
  font-size: (32/16)*1rem;
  font-weight: 600;
}
</style>