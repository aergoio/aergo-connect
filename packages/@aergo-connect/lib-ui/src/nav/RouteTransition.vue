<template>
  <div class="route-transition-wrap">
    <transition
      :name="transitionName"
      :mode="transitionMode"
      :enter-active-class="transitionEnterActiveClass"
      @beforeLeave="beforeLeave"
      @enter="enter"
      @afterEnter="afterEnter"
    >
      <slot/>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RouteConfig } from 'vue-router';

const DEFAULT_TRANSITION = 'slide';
const DEFAULT_TRANSITION_MODE = '';

/**
 * Component that figures out the correct route transition.
 * Put a <router-view> as immediate child.
 * Children are animated relative to current context (last position: relative).
 * If transition name is 'slide', applies 'slide-left' or 'slide-right' depending on the diff.
 * Heuristics for comparing from and to route:
 * 1. Diff of depth of route (number of / in the path)
 * 2. Diff of 'meta.index' attributes
 * If transition name is something else, applies either the from or to transitionName, or the default (fade).
 */
export default Vue.extend({
  name: `RouteTransition`,
  data() {
    return {
      prevHeight: '0px',
      prevWidth: '0px',
      transitionName: DEFAULT_TRANSITION,
      transitionMode: DEFAULT_TRANSITION_MODE,
      transitionEnterActiveClass: '',
    };
  },
  watch: {
    '$route'(to: RouteConfig, from: RouteConfig): void {
      let transitionName = from.meta.transitionName || to.meta.transitionName || DEFAULT_TRANSITION;
      if (from.meta.transitionName === 'fade' || to.meta.transitionName === 'fade') {
        // If one of them is fade, always use that
        transitionName = 'fade';
      } else if (transitionName === 'slide') {
        // For slide, calculate depth difference based on path or meta.index
        const depthDiff = from.path.split(`/`).length - to.path.split(`/`).length;
        const indexDiff = (from.meta.index && to.meta.index) && (from.meta.index - to.meta.index);
        transitionName = (indexDiff > 0 || depthDiff > 0) ? `slide-right` : `slide-left`;
      }
      this.transitionName = transitionName;
      this.transitionEnterActiveClass = `${transitionName}-enter-active`;
      // Use out-in mode for fade transitions
      this.transitionMode = transitionName === 'fade' ? 'out-in' : '';
    }
  },
  methods: {
    beforeLeave(element: HTMLElement): void {
      const style = getComputedStyle(element);
      //this.prevHeight = style.height;
      this.prevWidth = style.width;
      //element.style.height = this.prevHeight;
      element.style.width = this.prevWidth;
    },
    enter(element: HTMLElement): void {
      //element.style.height = this.prevHeight;
      element.style.width = this.prevWidth;
    },
    afterEnter(element: HTMLElement): void {
      //element.style.height = `auto`;
      element.style.width = `auto`;
    },
  },
});
</script>

<style lang="scss">
.route-transition-wrap {
  position: relative; /* Set animation context */
  height: 100%; /* Don't affect layout */
  width: 100%;
  overflow: hidden; /* Hide animation artifacts */
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.25s;
  transition-property: height, opacity;
  transition-timing-function: ease;
  overflow: hidden;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: .5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
  position: absolute !important;
  top: 0;
  left: 0;
}
.slide-right-enter {
  transform: translate(-100%, 0);
}
.slide-left-enter {
  transform: translate(100%, 0);
}
.slide-right-leave-active,
.slide-left-leave-active,
.slide-left-enter-to {
  transform: translate(0%, 0);
}
.slide-left-leave-to {
  transform: translate(-100%, 0);
}
.slide-right-leave-to {
  transform: translate(100%, 0);
}
.slide-right-enter-to {
  transform: translate(0%, 0);
}
.slide-right-leave-to,
.slide-left-leave-to {
  opacity: 0;
}
</style>