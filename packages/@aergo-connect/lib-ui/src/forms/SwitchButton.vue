<template>
  <label class="component switch-button" v-on:click="!disabled && $emit('input', !value)">
    <span class="switch-button-toggle" :class="{checked: !!value, disabled: disabled}"></span>
    <slot>{{label}}</slot>
  </label>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SwitchButton',
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: String,
  },
});
</script>

<style lang="scss">
.component.switch-button {
  display: flex;
  align-items: center;

  .switch-button-toggle {
    flex-shrink: 0;
    margin-right: 10px;
    font-size: 22px;
    background-color: #aaa;
    border-radius: 1em;
    width: 1.7em;
    height: 1em;
    display: inline-block;
    position: relative;
    transition: background-color .15s;
    user-select: none;
    cursor: pointer;

    &:after {
      font-size: 16px;
      content: "";
      position: absolute;
      top: .2em;
      left: .2em;
      width: 1em;
      height: 1em;
      border-radius: 1em;
      background-color: #fff;
      transition: all .15s;
    }


    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;

      &:after {
        opacity: 0.5; /* .5 * .5 = .25 */
      }
    }

    &.checked {
      border-color: #ff337f;
      background-color: #ff337f;

      &:after {
        left: 1.1em;
      }

      &.disabled {
        opacity: 0.5;

        &:after {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
