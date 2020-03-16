<template>
  <Button @click="handleClick" :to="to" type="icon" class="back-button"><Icon name="back" :size="36" /></Button>
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
  },
  methods: {
    handleClick() {
      // Default action, can be overridden with custom route by passing `to`
      if (typeof this.$router !== 'undefined') {
        this.$router.back();
      }
    },
  }
});
</script>

<style lang="scss">
.back-button {
  margin-left: -10px;
}
.header .back-button {
  margin-left: -7px;
}
</style>