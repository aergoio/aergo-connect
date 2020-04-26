<template>
  <div class="icon" :class="[`icon--${name}`]" :style="{width: size+'px'}">
    <component :is="`icon-${name}`" :width="`${size}px`" />
    <div v-if="badge" class="badge">{{badgeText}}</div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType, FunctionalComponentOptions } from 'vue';
import { IconName } from './types';

function namedRequireAll(context: __WebpackModuleApi.RequireContext, namePrefix = '') {
  const icons = {} as Record<string, FunctionalComponentOptions>;
  context.keys().forEach((key) => {
    const matched = key.match(/\/(.*?)\./i);
    if (matched && matched.length > 1) {
      const name = matched[1];
      icons[namePrefix + name] = context(key);
    }
  });
  return icons;
}

// Load all svg icons at compile time
const iconsContext = require.context('!!babel-loader!vue-svg-loader!./img', true, /\.svg$/i);
const icons = namedRequireAll(iconsContext, 'icon-');

export default Vue.extend({
  name: 'Icon',
  props: {
    name: {
      type: String as PropType<IconName>,
      required: true,
    },
    size: {
      type: Number,
      default: 24,
    },
    badge: Boolean,
    badgeText: String,
  },
  components: {
    ...icons,
  },
});
</script>

<style lang="scss">
.icon {
  line-height: 1;
  vertical-align: middle;
  position: relative;
  display: inline-block;
  position: relative;

  svg { 
    display: inline-block;
    vertical-align: middle;
  }

  .badge {
    position: absolute;
    background: #ff337f;
    top: 0;
    right: 0;
    transform: translate(6px, -6px);
    display: flex;
    font-size: 12px;
    line-height: 18px;
    padding: 0 4px;
    border-radius: 10px;
    color: #fff;
    align-items: center;
    justify-content: center;
  }
}
.icon:hover {
  .hover-darken {
    fill: #777;
  }
}
.icon:hover {
  .hover-remove-opacity {
    opacity: 0.8;
  }
}
.icon.active, .router-link-active .icon {
  .active-remove-opacity {
    opacity: 1;
  }
}
.inverted-colors .icon {
  .invertible-stroke {
    stroke: #fff;
  }
  .invertible-fill {
    fill: #aaa;
  }
}
</style>
