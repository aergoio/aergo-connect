<template>
  <ScrollView class="page">
    <div class="welcome-content">
      <Appear>
        <Heading class="big-title">Welcome to Aergo Connect</Heading>
      </Appear>
      <p><router-link :to="{ name: 'account-details', params: { address: 'AmgVbUZiReUVFXdYb4UVMru4ZqyicSsFPqumRx8LfwMKLFk66SNw' } }" class="text-link">Example</router-link></p>
    </div>

    <template #footer>
      <div class="content">
        <Appear :delay="0.6">
          <ButtonGroup vertical>
            <Button type="primary" :to="{ name: 'setup' }">Create new wallet</Button>
            <Button type="secondary" :to="{ name: 'account-import' }">Import your wallet</Button>
          </ButtonGroup>
        </Appear>
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import Appear from '@aergo-connect/lib-ui/src/animations/Appear.vue';

export default Vue.extend({
  components: {
    ScrollView,
    Button,
    ButtonGroup,
    Heading,
    Appear,
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