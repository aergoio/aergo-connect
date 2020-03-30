<template>
  <div class="name-details">
    <ScrollView class="name-list-wrap">
      <template #header>
        <div class="name-details-header">
          <span>
            Registered Names
            <span class="name-count" v-if="state === 'loaded'">{{names.length}}</span>
          </span>
          <router-link :to="{ name: 'account-name-create' }" class="add-btn"><Icon name="add-name" :size="24" /></router-link>
        </div>
      </template>
      <LoadingIndicator v-if="state === 'loading'" :size="40" />
      <div v-if="state === 'loaded' && names.length === 0" class="empty-state">No names registered.</div>
      <ul v-if="state === 'loaded' && names.length" class="name-list">
        <li v-for="name in names" :key="name">{{name}}</li>
      </ul>
    </ScrollView>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator';
import { LoadingIndicator, Icon } from '@aergo-connect/lib-ui/src/icons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';

@Component({
  components: { LoadingIndicator, Icon, ScrollView, },
})
export default class NameDetails extends Vue {
  @Prop({type: String, required: true}) readonly address!: string;
  state: 'initial' | 'loading' | 'loaded' | 'error' = 'initial';
  names: string[] = [];

  mounted() {
    this.state = 'loading';
    setTimeout(() => {
      this.state = 'loaded';
      // TODO
      //this.names = ['a', 'b', 'c'];
    }, 1000);
  }
}
</script>

<style lang="scss">
.name-details {
  font-size: (12/16)*1rem;
  overflow: hidden;
  height: 100%;
  
  .name-details-header {
    padding: 12px 24px;
    background-color: #fff;
    box-shadow: inset 0 -1px 0 0 #f2f2f2;
    display: flex;
    align-items: center;
    .add-btn {
      margin-left: auto;
    }
    .name-count {
      color: #ff337f
    }
  }
  .name-details-header, .name-list li {
    font-weight: 500;
    font-size: (13/16)*1rem;
  }
  .name-list-wrap {
    padding: 0 0 8px;
    background-color: #fafafa;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80px;

    header {
      width: 100%;
      margin-bottom: 8px;
    }
  }
  .empty-state {
    color: #666;
    text-align: center;
    margin-top: 15px;
  }
  .name-list {
    list-style: none;
    margin: 0 16px 16px;
    padding: 0;

    li {
      box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.08);
      padding: 12px;
      background-color: #fff;
      line-height: 20px;
      cursor: pointer;
    }
  }
  .loading-indicator {
    height: 100%;
  }
  .add-btn {
    cursor: pointer;
  }
}
</style>