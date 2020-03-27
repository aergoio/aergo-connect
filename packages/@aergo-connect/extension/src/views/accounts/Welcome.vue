<template>
  <ScrollView class="page">
    <div class="welcome-content">
      <Appear>
        <Heading class="big-title">Welcome to Aergo Connect</Heading>
      </Appear>
    </div>

    <template #footer>
      <div class="content">
        <Appear :delay="0.6">
          <ButtonGroup vertical>
            <Button type="primary" :to="{ name: 'setup', params: { next: 'account-create' } }">Create new wallet</Button>
            <Button type="secondary" :to="{ name: 'setup', params: { next: 'account-import' } }">Import your wallet</Button>
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
  margin-top: 100px;
  padding: 20px;
}
#app.page-welcome {
  background: url(../../assets/img/welcome-bg.jpg) 0 0 no-repeat;
  background-size: cover;
}
</style>