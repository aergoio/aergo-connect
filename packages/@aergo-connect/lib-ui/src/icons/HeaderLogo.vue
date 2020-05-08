<template>
  <div class="header-logo">
    <Icon :name="iconName" :size="36" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from './Icon.vue';

export default Vue.extend({
  components: {
    Icon,
  },
  props: {
    iconName: {
      type: String,
      default: 'logo',
    },
  },
});
</script>

<style lang="scss">
.header-logo {
  display: inline-block;
  background-color: #fff;
  border-radius: 100%;
  box-shadow: 0 0 1px 0 rgba(0,0,0, 0.25);
}
</style>