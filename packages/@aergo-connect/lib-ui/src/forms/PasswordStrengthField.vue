<template>
  <div>
    <TextField
      type="password"
      :variant="variant" 
      :value="value"
      :error="passwordError"
      errorType="warning"
      @input="handleInput" @blur="handleBlur" @submit="handleEnter"
    />
    <span class="input-error-text password-good" v-if="value && passwordStrength.score >= 3">Good <Icon name="checkmark-circle" :size="16" /></span>
    <span class="password-advice" v-if="value && passwordStrength.score < 3">
      <span v-if="passwordStrength.feedback.warning">{{passwordStrength.feedback.warning}}.<br></span>
      <span v-if="passwordStrength.feedback.suggestions.length">{{passwordStrength.feedback.suggestions[0]}}<br></span>
      You can use this passphrase, but it may be easily guessable.
    </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Icon from '../icons/Icon.vue';
import TextField from './TextField.vue';
import { InputVariant, InputVariants } from './types';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';

export default Vue.extend({
  components: {
    TextField,
    Icon,
  },
  props: {
    value: String,
    label: String,
    variant: {
      type: String as PropType<InputVariant>,
      default: InputVariants[0],
    },
  },
  computed: {
    passwordError(): string {
      if (this.value && this.passwordStrength.score < 3) return 'Weak passphrase';
      return '';
    },
    passwordStrength(): ZXCVBNResult {
      return zxcvbn(this.value);
    },
  },
  methods: {
    handleInput(value: string): void {
      this.$emit('input', value);
    },
    handleBlur(value: string): void {
      this.$emit('blur', value);
    },
    handleEnter(value: string): void {
      this.$emit('submit', value);
    },
  }
});
</script>

<style lang="scss">
.password-advice {
  color: #666;
  font-size: (12/16)*1rem;
}
.password-good {
  color: #00c789;
  font-size: (12/16)*1rem;
  .adjustable-stroke {
    stroke: #00c789;
  }
}
</style>