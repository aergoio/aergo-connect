<template>
  <div id="app">
    <RouteTransition>
      <router-view/>
    </RouteTransition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import RouteTransition from '@aergo-connect/lib-ui/src/nav/RouteTransition.vue';

export default Vue.extend({
  components: {
    RouteTransition,
  },
});
</script>

<style lang="scss">
body {
  background-color: #f0f0f0;
  margin: 0;
  padding: 10px;
}

#app {
  max-width: 360px;
  max-height: 100vh;
  height: 600px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}
</style>
