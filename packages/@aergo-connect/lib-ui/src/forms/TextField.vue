<template>
  <div class="text-field" :class="classes" @focusin="focused=true" @focusout="focused=false">
    <input
      :value="value"
      :type="type"
      :disabled="disabled"
      @input="handleInput"
      @blur="handleBlur"
      @keyup.enter="handleEnter" />

    <LoadingIndicator v-if="state === 'loading'" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { InputVariant, InputVariants, InputType, InputTypes, InputStates, InputState } from './types';
import LoadingIndicator from '../icons/LoadingIndicator.vue';

export default Vue.extend({
  components: {
    LoadingIndicator,
  },
  props: {
    value: [String, Number],
    type: {
      type: String as PropType<InputType>,
      default: InputTypes[0],
    },
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
        `type-${this.type}`,
        `state-${this.state}`,
        this.disabled ? 'is-disabled' : '',
        this.error ? 'has-error' : '',
        this.focused ? 'is-focused' : '',
      ];
    }
  },
  methods: {
    handleInput(event: InputEvent): void {
      this.$emit('input', (event.target as HTMLFormElement).value);
    },
    handleBlur(event: FocusEvent): void {
      this.$emit('blur', (event.target as HTMLFormElement).value);
    },
    handleEnter(event: KeyboardEvent): void {
      this.$emit('submit', (event.target as HTMLFormElement).value);
    },
  }
});
</script>

<style lang="scss">
.text-field {
  line-height: 60px;
  min-height: 60px;
  display: flex;

  input {
    border: 0;
    flex: 1;
    padding: 15px;
    outline: none;
    background-color: transparent;
  }

  &.is-disabled {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &.variant-default {
    border: 1px solid rgba(217, 217, 217, 1);
    border-radius: 3px;
  
    input {
      font-size: (14/16)*1rem;
      border-radius: 3px;
    }

    &.is-focused {
      outline: rgba(0, 103, 244, 0.247) auto 5px;
      outline-offset: -2px;
    }
  }

  &.variant-main {
    border-bottom: 1px solid rgba(34, 34, 34, 1);
    input {
      font-size: (20/16) * 1rem;
      font-weight: 500;
    }
    &.state-invalid {
      border-color:  rgba(238, 70, 72, 1);
      box-shadow: 0 1px 0 0 rgba(238, 70, 72, 1);
    }
  }

  .loading-indicator {
    margin-right: 15px;
  }
}
</style>