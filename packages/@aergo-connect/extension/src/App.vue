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
  async mounted() {
    console.log('isUnlocked', await this.$background.isUnlocked());
  }
});
</script>

<style lang="scss">
body {
  margin: 0;
  font-size: 100%;
}

#app {
  max-width: 360px;
  max-height: 100vh;
  height: 600px;
  margin: 0 auto;
  background-color: #fff;
  position: relative;
  overflow: hidden;
}

body.fullpage {
  padding: 10px;

  #app {
    border-radius: 8px;
    box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0.08);
  }
}
</style>
