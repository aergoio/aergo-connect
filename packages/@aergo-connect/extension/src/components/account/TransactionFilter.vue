<template>
  <ul class="transaction-filter">
    <li v-for="[val, label] in options" :key="val" @click="select(val)" :class="{selected: val === value}">
      {{label}}
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop, Emit } from 'vue-property-decorator';

type Option = [string, string];

@Component
export default class HistoryList extends Vue {
  @Prop({type: Array, required: true}) readonly options!: Option[];
  @Prop({type: String, required: true}) readonly value!: Option[1];

  @Emit()
  select(value: Option[1]) {
    return value;
  }
}
</script>

<style lang="scss">
.transaction-filter {
  font-size: (13/16)*1rem;
  font-weight: 500;
  color: #777;
  list-style: none;
  margin: 0;
  padding: .75rem 0;
  display: flex;
  line-height: 2;

  li {
    margin-right: 24px;
    cursor: pointer;
    &.selected {
      color: #222;
    }
  }
  
}
</style>