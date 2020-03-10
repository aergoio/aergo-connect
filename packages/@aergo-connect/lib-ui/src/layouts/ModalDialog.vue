<template>
  <transition name="modal">
    <div class="modal-container" v-if="visible">
      <div class="modal-dialog">
        <slot></slot>
      </div>
      <div class="backdrop"></div>
    </div>
  </transition>
</template>


<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeypress);
  },
  destroyed() {
    window.removeEventListener("keydown", this.handleKeypress);
  },
  methods: {
    handleKeypress(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        this.$emit('close');
      }
    }
  }
});
</script>

<style lang="scss">
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.45);
}
.modal-dialog {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background-color: #fff;
  border-radius: 8px 8px 0 0;

  .modal-dialog-content {

  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity ease .25s;
  .modal-dialog {
    transform: translateY(0%);
    transition: all ease .25s;
  }
}
.modal-enter,
.modal-leave-active {
  opacity: 0;
  .modal-dialog {
    transform: translateY(100%);
  }
}
</style>