<template>
  <div class="header">
    <slot></slot>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
});
</script>

<style lang="scss">
.header {
  height: 68px;
  display: flex;
  align-items: center;
  padding: 0 16px;

  > * + * {
    margin-left: 14px;
  }
}
</style>