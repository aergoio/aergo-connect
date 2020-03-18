<template>
  <div class="next-button-wrap">
    <Button @click="$emit('click')" :to="to" type="primary-icon" class="next-button" :disabled="disabled" :loading="loading"><Icon name="next" :size="25" /></Button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Button from './Button.vue';
import { RawLocation } from 'vue-router';
import Icon from '../icons/Icon.vue';

export default Vue.extend({
  components: {
    Button,
    Icon,
  },
  props: {
    to: {
      type: [String, Object] as PropType<RawLocation>,
    },
    disabled: Boolean,
    loading: Boolean,
  },
});
</script>

<style lang="scss">
.next-button-wrap {
  display: flex;
  justify-content: flex-end;
}
</style>