<template>
  <section class="scroll-view">
    <header v-if="$slots.header">
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';

/**
 * A nestable scroll view, with optional header and footer.
 */
export default Vue.extend({
});
</script>

<style lang="scss">
.scroll-view {
  &, > main {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }
  
  display: flex;
  flex-direction: column;

  > main {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/*
  * Scrollbar styling. A bit of a hack.
  * https://stackoverflow.com/a/45420691/700283
  */
$scrollBarSize: 6px;
$trackSize: 20px;
$margin: ($trackSize - $scrollBarSize)/2;
.scroll-view main {
  &::-webkit-scrollbar {
    width: $trackSize;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 $margin $margin rgba(0, 0, 0, 0.15);
    border: solid $margin transparent;
    border-radius: $trackSize;
  }
  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 $margin $margin rgba(0, 0, 0, 0.35);
    border: solid $margin transparent;
    border-radius: $trackSize;
  }
}
.inverted-colors .scroll-view main {
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 $margin $margin rgba(255, 255, 255, 0.3);
  }
  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 $margin $margin rgba(255, 255, 255, 0.5);
  }
}
</style>