<template>
  <ScrollView class="page">
    <template #header>
      Header
    </template>

    <div class="welcome-content">
      <h1 class="big-title">Welcome to Aergo Connect</h1>
    </div>

    <template #footer>
      <div style="margin: 20px;">
        <ButtonGroup vertical>
          <Button type="primary" to="/new/create">Create your wallet</Button>
          <Button type="secondary">Import your wallet</Button>
        </ButtonGroup>
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import { Button } from '@aergo-connect/lib-ui/src/buttons';
import ButtonGroup from '@aergo-connect/lib-ui/src/buttons/ButtonGroup.vue';

export default Vue.extend({
  components: {
    ScrollView,
    Button,
    ButtonGroup,
  },
});
</script>

<style lang="scss">
.welcome-content {
  margin-top: 116px;
  padding: 20px;
}
.big-title {
  font-size: (44/16)*1rem;
  font-weight: 600;
}
</style>