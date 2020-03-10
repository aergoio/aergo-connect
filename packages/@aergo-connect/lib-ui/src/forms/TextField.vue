<template>
  <InputContainer :disabled="disabled" :variant="variant" :state="state" :error="error" :class="classes">
    <input
      :value="value"
      :type="type"
      :disabled="disabled"
      @input="handleInput"
      @blur="handleBlur"
      @keyup.enter="handleEnter" />
  </InputContainer>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { InputVariant, InputVariants, InputType, InputTypes, InputStates, InputState } from './types';
import InputContainer from './InputContainer.vue';

export default Vue.extend({
  components: {
    InputContainer,
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
  computed: {
    classes(): string[] {
      return [
        'text-field',
        `type-${this.type}`,
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
  input {
    border: 0;
    flex: 1;
    padding: 15px;
    outline: none;
    background-color: transparent;
  }

  &.variant-default {
    input {
      font-size: (14/16)*1rem;
      border-radius: 3px;
    }
  }

  &.variant-main {
    input {
      font-size: (20/16) * 1rem;
      font-weight: 500;
    }
  }
}
</style>