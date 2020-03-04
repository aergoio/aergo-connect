<template>
  <button class="button" :class="classes" :disabled="disabled" @click="$emit('click')">
    <template v-if="loading">
      <LoadingIndicator class="button-loading-indicator" />
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ButtonType, ButtonSize } from './types';
import LoadingIndicator from '../icons/LoadingIndicator.vue';

export default Vue.extend({
  name: 'Button',
  props: {
    type: {
      type: String as PropType<ButtonType>,
      default: 'primary',
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: 'default',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LoadingIndicator,
  },
  beforeUpdate() {
    if (this.loading) {
      // Animate into the loading state
      const $el = this.$el as HTMLElement;
      $el.style.minWidth = $el.clientWidth + 'px';
      $el.style.width = $el.clientWidth + 'px';
      setTimeout(() => {
        $el.style.minWidth = '50px';
        $el.style.width = 'auto';
      }, 300);
    }
  },
  computed: {
    classes(): string[] {
      return [
        `button-type-${this.type}`,
        `button-size-${this.size}`,
        this.loading ? `button-loading` : '',
        this.type === 'primary' ? 'inverted-colors' : '',
      ];
    },
  },
});
</script>

<style lang="scss">
.button {
  box-sizing: border-box;
  line-height: (30/15)*1em;
  min-height: (30/15)*1em;
  padding: 1px 1em;
  border-radius: 3px;

  display: flex;
  text-decoration: none;
  text-align: center;
  align-items: center;
  justify-content: space-around;

  cursor: pointer;

  font-weight: 500;
  font-size: (15/16)*1em;

  outline: none;
  border: 0;
  box-shadow: inset 0 0 1px 0 rgba(0,0,0,0.6);

  transition: min-width .35s ease-in;

  &[disabled] {
    cursor: not-allowed;
    opacity: .75;
  }

  &.button-size-default {
    line-height: 3em;
    min-height: 4em;
    padding: .5em 2.5em;
  }
  &.button-type-primary {
    background-color: #272727;
    color: #fff;

    &[disabled] {
      cursor: not-allowed;
      opacity: .3;
    }
  }
  &.button-type-secondary {
    box-shadow: none;
  }
}
</style>