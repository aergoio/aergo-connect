<template>
  <ScrollView class="page">
    <InvertedColors class="account-imported-content">
      <div class="content">
        <Heading class="big-title" animated>Success!</Heading>
        <p>Your account has been imported.</p>
      </div>
    </InvertedColors>
    <template #footer>
      <div class="content">
        <ButtonGroup vertical>
          <Button type="secondary" :to="{ name: 'account-details' }">View Account Details</Button>
        </ButtonGroup>
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import InvertedColors from '@aergo-connect/lib-ui/src/theme/InvertedColors.vue'; 

import Vue from 'vue';
import Component from 'vue-class-component'

@Component({
  components: {
    ScrollView,
    Heading,
    Button,
    ButtonGroup,
    InvertedColors,
  },
})
export default class AccountImported extends Vue {
}
</script>

<style lang="scss">
.account-imported-content {
  background-color: #1b1b1b;
  color: #fff;
  min-height: 100%;
}
</style>