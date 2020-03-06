<template>
  <span class="elide" :class="[`elide-mode-${mode}`, expectEllipsis ? 'compensate-ellipsis' : '']">
    <span class="fixed" v-if="mode === 'middle-fixed-head'">{{fixedText}}</span>
    <span class="head" v-if="mode === 'tail' || mode === 'middle-fixed-tail'">{{elidedText}}</span>
    <span class="tail" v-if="mode === 'head' || mode === 'middle-fixed-head'">{{elidedText}}</span>
    <span class="fixed" v-if="mode === 'middle-fixed-tail'">{{fixedText}}</span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

// Roughly how many charachters the ellipsis takes.
// Only starts applying effect when text is longer than `fixed` + `ellipsisWidth`.
const ellipsisWidth = 2;

export default Vue.extend({
  props: {
    mode: {
      type: String,
      required: true,
      default: 'tail', // head, middle-fixed-head, middle-fixed-tail
    },
    fixed: {
      type: Number,
      default: 4,
    },
    text: {
      type: String,
      required: true,
    },
    expectEllipsis: Boolean, // expect ellipsis to be applied in most cases?
  },
  computed: {
    canElideMiddle(): boolean {
      return this.text.length > this.fixed + ellipsisWidth;
    },
    elidedText(): string {
      if (this.canElideMiddle) {
        if (this.mode === 'middle-fixed-tail') {
          return this.text.substr(0, this.text.length - this.fixed);
        }
        if (this.mode === 'middle-fixed-head') {
          return this.text.substr(this.fixed);
        }
      }
      return this.text;
    },
    fixedText(): string {
      if (this.canElideMiddle) {
        if (this.mode === 'middle-fixed-head') {
          return this.text.substr(0, this.fixed);
        }
        if (this.mode === 'middle-fixed-tail') {
          return this.text.substr(this.text.length - this.fixed);
        }
      }
      return '';
    }
  }
});
</script>

<style lang="scss">
.elide {
  display: flex;
  max-width: 100%;
  user-select: all;
  .head, .tail {
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 1em;
  }
  .tail {
    direction: rtl;
    text-align: left;
  }
  /*
   * Compensate for small space introduced by ellipsis.
   * Only use when you expect ellipsis to be applied in most cases.
   * Looks bad if used when ellipsis is not applied.
   */
  &.compensate-ellipsis {
    &.elide-mode-middle-fixed-tail .fixed {
      transform: translateX(-.18em);
    }
    &.elide-mode-middle-fixed-head .tail {
      transform: translateX(-.18em);
    }
  }
}
</style>