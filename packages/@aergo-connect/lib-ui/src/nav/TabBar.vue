<template>
  <nav class="tab-bar">
    <slot></slot>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';

/**
 * A tab bar.
 * Immediate children will be styled as tab items.
 * Use <router-link> as children and place a <router-view> somewhere outside this component.
 */
export default Vue.extend({
});
</script>

<style lang="scss">
.tab-bar {
  display: flex;

  > * {
    flex: 1;
    text-align: center;
    background-color: rgba(242, 242, 242, 1);
    min-height: 48px;
    line-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  > .router-link-active {
    background-color: #fff;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
}
</style>