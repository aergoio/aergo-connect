<template>
  <div class="component loading-indicator" :class="`type-${type}`">
    <div class="balls" v-if="type === 'typing'" :style="{fontSize: `${size}px`}">
      <div/><div/><div/>
    </div>

    <svg class="spinner" v-if="type === 'spinner'" :width="size" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <circle class="path" fill="none" stroke-width="2" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LoadingIndicator',
  props: {
    type: {
      type: String,
      default: 'spinner',
    },
    size: {
      type: Number,
      default: 20,
    },
  },
});
</script>

<style lang="scss">
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Balls */
.loading-indicator.type-typing {
  .balls {
    font-size: 15px;
    width: 1em;
    height: 0.6em;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
  }
  .balls div {
    width: 0.2em;
    height: 0.2em;
    border-radius: 50%;
    background-color: #111;
    transform: translateY(-100%);
    animation: wave 0.7s ease-in-out alternate infinite;
  }
  .balls div:nth-of-type(1) {
    animation-delay: -0.4s;
  }
  .balls div:nth-of-type(2) {
    animation-delay: -0.2s;
  }
}
.inverted-colors .balls div {
  background-color: #fff;
}
@keyframes wave {
  0% {
    transform: translateY(-100%);
  }
  94% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(100%);
  }
}


/* Spinner */
.loading-indicator.type-spinner {
  $offset: 187;
  $duration: 1.4s;
  .spinner {
    animation: rotator $duration linear infinite;
  }
  @keyframes rotator {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(270deg); }
  }
  .path {
    stroke-dasharray: $offset;
    stroke-dashoffset: 0;
    transform-origin: center;
    stroke: #ff337f;
    animation: dash $duration ease-in-out infinite;
  }
  @keyframes dash {
    0% {
      stroke-dashoffset: $offset;
    }
    50% {
      stroke-dashoffset: $offset/4;
      transform: rotate(135deg);
    }
    100% {
      stroke-dashoffset: $offset;
      transform: rotate(450deg);
    }
  }
}
.inverted-colors .loading-indicator .path {
  stroke: #fff;
}
</style>
