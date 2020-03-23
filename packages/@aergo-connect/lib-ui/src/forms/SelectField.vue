<template>
  <div class="select-container" :class="{'use-modal-sheet': modalSheet, 'use-dropdown': !modalSheet}">
    <label>
      <span class="input-label" v-if="label">{{label}}</span>
      <InputContainer :disabled="disabled" :variant="variant" :state="state" :error="error" :class="classes"
        @cancel="close" @pointerNext="selectNext" @pointerPrevious="selectPrevious" @accept="handleAccept" @blur="handleBlur">
        <input type="text" class="focus-target" ref="focusTarget" />
        <span class="current-value" @click="openIfClosed">{{valueLabel}}</span>
      
        <div class="toggle-button" v-show="state !== 'loading'" @click="toggle">
          <Icon name="dropdown" :size="36" />
        </div>
        
        <component :is="modalSheet ? 'ModalDialog' : 'div'" class="dropdown" :visible="optionsVisible" :title="dropdownTitle">
          <div class="dialog-options" v-if="optionsVisible">
            <div v-for="(option, index) in optionDict" :key="option.value" class="dialog-option" @mousedown="selectOption(option.value, index)" :class="{focused: index === focusedOptionIndex}">
              {{option.label}}
              <Icon name="checkmark-circle" :size="20" v-if="index === selectedOptionIndex" />
            </div>
          </div>
        </component>
      </InputContainer>
    </label>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { InputVariant, InputVariants, InputStates, InputState, SelectOption, isSelectOptionWithLabel, } from './types';
import InputContainer from './InputContainer.vue';
import Icon from '../icons/Icon.vue';
import ModalDialog from '../layouts/ModalDialog.vue';

interface OptionDict {
  value: string | number;
  label: string;
}

export default Vue.extend({
  components: {
    InputContainer,
    Icon,
    ModalDialog,
  },
  data() {
    return {
      optionsVisible: false,
      selectedOptionIndex: 0,
      focusedOptionIndex: -1,
    };
  },
  props: {
    value: [String, Number],
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
    options: {
      type: Array as PropType<SelectOption[]>,
      default: [],
    },
    modalSheet: Boolean,
    dropdownTitle: String,
  },
  computed: {
    classes(): string[] {
      return [
        'select-field',
        `options-${this.optionsVisible?'visible':'hidden'}`,
      ];
    },
    optionDict(): OptionDict[] {
      return this.options.map((option): OptionDict => {
        if (isSelectOptionWithLabel(option)) {
          return { value: option[0], label: option[1] };
        }
        return { value: option, label: option };
      });
    },
    valueLabel(): string {
      const selected = this.optionDict.find(option => option.value === this.value);
      return selected ? selected.label : `${this.value}`;
    },
  },
  mounted() {
    this.selectedOptionIndex = this.optionDict.findIndex(option => option.value === this.value);
    if (this.selectedOptionIndex === -1) {
      this.selectedOptionIndex = 0;
    }
  },
  methods: {
    toggle(): void {
      this.optionsVisible = !this.optionsVisible;
      if (this.optionsVisible) {
        this.open();
      }
    },
    openIfClosed(): void {
      if (!this.optionsVisible) {
        this.open();
      }
    },
    open(): void {
      this.optionsVisible = true;
      this.focusedOptionIndex = -1;
      (this.$refs.focusTarget as HTMLElement).focus();
    },
    close(): void {
      this.optionsVisible = false;
    },
    handleBlur(): void {
      this.close();
      this.$emit('blur', this.optionDict[this.selectedOptionIndex].value);
    },
    selectOption(value: string, index: number): void {
      this.$emit('input', value);
      this.selectedOptionIndex = index;
      this.focusedOptionIndex = index;
      this.close();
    },
    selectNext(): void {
      if (this.focusedOptionIndex < this.options.length-1) {
        this.focusedOptionIndex++;
      }
    },
    selectPrevious(): void {
      this.focusedOptionIndex--;
      if (this.focusedOptionIndex < 0) {
        this.focusedOptionIndex = 0;
      }
    },
    handleAccept(): void {
      if (!this.optionsVisible) {
        this.open();
        return;
      }
      if (this.focusedOptionIndex !== -1) {
        this.selectedOptionIndex = this.focusedOptionIndex;
        this.$emit('input', this.optionDict[this.selectedOptionIndex].value);
      }
      this.close();
    },
  }
});
</script>

<style lang="scss">
.select-container.use-dropdown {
  position: relative;
}
.select-field {
  .focus-target {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }
  .current-value {
    flex: 1;
    padding: 0 15px;
  }
  &.variant-main {
    .current-value {
      font-size: (20/16) * 1rem;
      font-weight: 500;
    }
  }
  .current-value, .toggle-button, .dialog-option {
    cursor: pointer;
    user-select: none;
  }

  .toggle-button {
    margin-right: 8px;
    
    .icon {
      transition: transform .15s;
    }
  }
  &.options-visible  {
    .toggle-button .icon {
      transform: rotate(180deg);
    }
  }
  .dropdown:not(.modal-container) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #fff;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
    animation: slideOut ease-out .3s;
    overflow: hidden;
    .modal-title {
      display: none;
    }
  }
  .dialog-options {
    .dialog-option {
      font-size: (13/16)*1rem;
      font-weight: 500;
      padding: 0 14px 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &.focused {
        background-color: rgba(0,0,0,0.04);
      }
    }
  }
}
.use-dropdown .select-field.options-visible  {
  background-color: rgba(0,0,0,0.06);
}

@keyframes slideOut {
  0% { max-height: 0%; }
  100% { max-height: 50vh; }
}
</style>