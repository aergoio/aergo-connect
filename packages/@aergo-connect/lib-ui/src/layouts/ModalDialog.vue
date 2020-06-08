<template>
  <transition name="modal">
    <div class="modal-container" v-if="visible">
      <div class="modal-dialog">
        <Heading tag="h2" class="modal-title" v-if="title">
          {{title}}
          <Button @click="$emit('close')" type="icon"><Icon name="close" :size="24" /></Button>
        </Heading>
        <slot></slot>
      </div>
      <div class="backdrop" @click="$emit('close')"></div>
    </div>
  </transition>
</template>


<script lang="ts">
import Vue from 'vue';
import Button from '../buttons/Button.vue';
import Icon from '../icons/Icon.vue';
import Heading from '../content/Heading.vue';

export default Vue.extend({
  components: {
    Button,
    Icon,
    Heading,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: String,
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
  z-index: 100;
}
.modal-dialog {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background-color: #fff;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -1px 6px rgba(0,0,0,0.1);

  > .content {
    padding: 24px;
  }

  .modal-title {
    margin: 15px 24px 0 24px;
    line-height: 2;
    font-weight: 500;
  }
  .dialog-options {
    margin-bottom: 20px;
  
    &.focused {
      background-color: rgba(0,0,0,0.04);
    }
    
    > * {
      font-size: (13/16)*1rem;
      line-height: 60px;
      font-weight: 500;
      padding: 0 14px 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;

      > span {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 20px;
        }
      }
    }
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