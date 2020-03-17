<template>
  <div>
    <label>
      <span class="input-label" v-if="label">{{label}}</span>
      <InputContainer :disabled="disabled" :variant="variant" :state="state" :error="error" :class="classes">
        <input
          :value="value"
          :type="type"
          :disabled="disabled"
          :autoComplete="autoComplete"
          @input="handleInput"
          @change="handleFileInput"
          @blur="handleBlur"
          @keyup.enter="handleEnter"
          accept=".txt"
          ref="inputElement" />
      </InputContainer>
      <span class="input-error-text" v-if="error">{{error}} <Icon name="danger" :size="16" /></span>
    </label>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { InputVariant, InputVariants, InputType, InputTypes, InputStates, InputState } from './types';
import InputContainer from './InputContainer.vue';
import Icon from '../icons/Icon.vue';

export default Vue.extend({
  components: {
    InputContainer,
    Icon,
  },
  props: {
    value: [String, Number],
    label: String,
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
    autoComplete: String,
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
    handleFileInput(): void {
      const $elem = this.$refs.inputElement as HTMLInputElement;
      if (!$elem.files || $elem.files.length === 0) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          this.$emit('file', e.target.result);
        }
      };
      reader.readAsText($elem.files[0]);
    }
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
      padding-left: 4px;
    }
    &.type-password input {
      font-size: 2rem;
      overflow: hidden;
    }
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
  .icon {
    vertical-align: text-bottom;
    margin-left: 2px;
  }
}
</style>