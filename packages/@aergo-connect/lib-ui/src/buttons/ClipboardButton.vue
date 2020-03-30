<template>
  <div @click="copyToClipboard" class="copy-button"><Icon :name="copied ? 'checkmark' : 'copy'" :size="36" /></div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../icons/Icon.vue';
import copy from 'copy-to-clipboard';

export default Vue.extend({
  components: {
    Icon,
  },
  props: {
    value: {
      type: String,
    },
  },
  data() {
    return {
      copied: false,
      timeout: undefined as number | undefined,
    };
  },
  methods: {
    copyToClipboard(): void {
      copy(this.value);
      this.copied = true;
      (this.$el as HTMLElement).blur();
      if (this.timeout) {
        window.clearTimeout(this.timeout);
      }
      this.timeout = window.setTimeout(() => {
        this.copied = false;
      }, 4500);
    },
  },
});
</script>

<style lang="scss">
.copy-button {
  display: inline-block;
  border-radius: 100%;
  box-shadow: inset 0 0 0 1px #eee;
  cursor: pointer;
}
.inverted-colors .copy-button {
  background: rgba(#000, 0.5);
  box-shadow: none;
}
</style>