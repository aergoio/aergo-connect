<template>
  <div>
    <label>
      <span class="input-label" v-if="label">{{label}}</span>
      <InputContainer :disabled="disabled" :variant="variant" :state="state" :error="error" :class="classes">
        <Identicon :text="value" />
        <textarea
          :value="value"
          :disabled="disabled"
          :autoComplete="autoComplete"
          @input="handleInput"
          @blur="handleBlur"
          @keyup.enter="handleEnter"
          autocorrect="off" autocapitalize="off" spellcheck="false"
          />
      </InputContainer>
      <span class="input-error-text" v-if="error">{{error}} <Icon name="danger" :size="16" /></span>
    </label>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { InputVariant, InputVariants, InputStates, InputState } from './types';
import InputContainer from './InputContainer.vue';
import Identicon from '../content/Identicon.vue';
import Icon from '../icons/Icon.vue';

import { Address } from '@herajs/common';

function sanitizeInput(text: string): string {
  try {
    const address = new Address(text);
    return `${address}`;
  } catch(e) {
    return text;
  }
}

export default Vue.extend({
  components: {
    InputContainer,
    Icon,
    Identicon,
  },
  props: {
    value: String,
    label: String,
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
    autoComplete: String,
  },
  computed: {
    classes(): string[] {
      return [
        'text-field',
        'address-field',
      ];
    },
    sanitizedValue() {
      try {
        const address = new Address(this.value);
        return `${address}`;
      } catch (e) {
        return '';
      }
    }
  },
  methods: {
    handleInput(event: InputEvent): void {
      this.$emit('input', sanitizeInput((event.target as HTMLFormElement).value));
    },
    handleBlur(event: FocusEvent): void {
      this.$emit('blur', sanitizeInput((event.target as HTMLFormElement).value));
    },
    handleEnter(event: KeyboardEvent): void {
      this.$emit('submit', sanitizeInput((event.target as HTMLFormElement).value));
    },
  }
});
</script>

<style lang="scss">
.address-field {
  .identicon {
    margin-left: 10px;
    width: 40px;
    height: 40px;
  }
  textarea {
    border: 0;
    flex: 1;
    padding: 0 12px;
    outline: none;
    background-color: transparent;
    width: 100px;
    font-size: (13/16)*1rem;
    line-height: 1.3;
    resize: none;
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
      padding-left: 4px;
    }
    &.type-password input {
      font-size: 2rem;
      overflow: hidden;
    }
  }
}
</style>