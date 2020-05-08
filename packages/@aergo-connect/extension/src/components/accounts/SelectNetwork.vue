<template>
  <div class="select-network">
    <SelectField variant="main" :options="processedOptions" :value="value" @input="handleInput" modal-sheet dropdownTitle="Network" />
    <span class="button-configure-networks" @click="configure">Configure networks</span>
  </div>
</template>

<script lang="ts">
import SelectField from '@aergo-connect/lib-ui/src/forms/SelectField.vue';
import { Prop } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component'
import { isPublicChainId, PublicChainData } from '../../config';

export function keys<O>(o: O): (keyof O)[] {
    return Object.keys(o) as (keyof O)[];
}
const DEFAULT_OPTIONS = keys(PublicChainData).map(key => [key, PublicChainData[key].label]);

@Component({
  components: {
    SelectField,
  },
})
export default class Create extends mixins() {
  @Prop(String) readonly value!: string;

  options: string[][] = [];

  get processedOptions() {
    return this.options.map(option => (
      {
        value: option[0],
        label: option[1],
        icon: isPublicChainId(option[0]) ? 'logo' : 'network-other',
      }
    ));
  }

  created() {
    this.options = [...DEFAULT_OPTIONS];
    this.fetchNetworks();
  }
  async fetchNetworks() {
    const chains = Object.values(await this.$background.getNetworks()) as any;
    this.options.push(...chains.map((item: any) => [item.chainId, item.chainId]));
  }
  configure() {
    this.$router.push({ name: 'networks-list' });
  }
  handleInput(value: string): void {
    this.$emit('input', value);
  }
}
</script>

<style lang="scss">
.button-configure-networks {
  font-size: (13/16)*1rem;
  color: #666;
  cursor: pointer;
}
</style>