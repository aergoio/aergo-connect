<template>
  <Button @click="handleClick" :to="to" type="secondary">Back</Button>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Button from './Button.vue';
import { RawLocation } from 'vue-router';

export default Vue.extend({
  components: {
    Button,
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