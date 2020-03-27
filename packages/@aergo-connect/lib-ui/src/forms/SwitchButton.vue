<template>
  <label class="component switch-button" v-on:click="!disabled && $emit('input', !value)">
    <slot>{{label}}</slot>
    <span class="switch-button-toggle" :class="{checked: !!value, disabled: disabled}"></span>
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
  font-size: (13/16)*1rem;
  color: #222;

  .switch-button-toggle {
    flex-shrink: 0;
    margin-left: auto;
    font-size: 18px;
    background-color: #aaa;
    border-radius: 1em;
    border: 1px solid #ccc;
    width: 1.85em;
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
      top: .1em;
      left: .1em;
      width: 16px;
      height: 16px;
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
      border-color: lighten(#ff337f, 20%);
      background-color: #ff337f;

      &:after {
        left: 1em;
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
