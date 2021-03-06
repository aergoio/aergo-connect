<template>
  <div class="input-field" :class="classes" @focusin="focused=true" @focusout="focused=false; $emit('blur')"
    @keydown.down.capture="$emit('pointerNext')"
    @keydown.up.capture="$emit('pointerPrevious')"
    @keydown.enter.stop.capture="$emit('accept')"
    @keydown.esc.capture="$emit('cancel')"
    >
    <slot></slot>

    <LoadingIndicator v-if="state === 'loading'" />
    <Icon name="checkmark" :size="24" v-if="state === 'valid'" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { InputVariant, InputVariants, InputStates, InputState } from './types';
import LoadingIndicator from '../icons/LoadingIndicator.vue';
import Icon from '../icons/Icon.vue';

export default Vue.extend({
  components: {
    LoadingIndicator,
    Icon,
  },
  props: {
    variant: {
      type: String as PropType<InputVariant>,
      default: InputVariants[0],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String as PropType<InputState>,
      default: InputStates[0],
    },
    error: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      focused: false,
    };
  },
  computed: {
    classes(): string[] {
      return [
        `variant-${this.variant}`,
        `state-${this.state}`,
        this.disabled ? 'is-disabled' : '',
        this.error ? 'has-error' : '',
        this.focused ? 'is-focused' : '',
      ];
    }
  },
});
</script>

<style lang="scss">
.input-field {
  line-height: 60px;
  min-height: 60px;
  display: flex;
  align-items: center;
  margin-bottom: 1em;

  transition: box-shadow .1s;

  &.is-disabled {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &.variant-default {
    box-shadow: inset 0 0 0 1px rgba(217, 217, 217, 1);
    border-radius: 3px;

    &.is-focused {
      outline: none;
      box-shadow: inset 0 0 0 1px rgba(34, 34, 34, 1);
    }
  }

  &.variant-main {
    box-shadow: inset 0 -1px 0 0 rgba(34, 34, 34, 1);
    &.is-focused:not(.options-visible) {
      //box-shadow: inset 0 -1px 0 0 rgba(0, 103, 244, 1);
      background-color: rgba(0,0,0,0.04);
    }
    &.state-invalid {
      box-shadow: inset 0 -2px 0 0 rgba(238, 70, 72, 1);
    }
  }

  > .loading-indicator, > .icon--checkmark {
    margin-right: 15px;
  }
}
.input-label {
  font-size: (13/16)*1rem;
  font-weight: 500;
  letter-spacing: -0.16px;
  color: rgba(34, 34, 34, 0.65);
  display: block;
  margin-bottom: .5em;
}
.input-error-text {
  font-size: (12/16)*1rem;
  color: #EE4648;
  font-weight: 500;
  display: block;
  margin-bottom: 12px;
  margin-top: -7px;
  word-break: break-word;
  .icon {
    vertical-align: text-bottom;
    margin-left: 2px;
  }
  &.warning {
    color: #ef8a26;
    .adjustable-stroke {
      stroke: #ef8a26;
    }
  }
}
</style>