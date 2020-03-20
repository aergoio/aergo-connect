<template>
  <ScrollView class="page">
    <InvertedColors class="account-created-content">
      <div class="content">
        <Heading class="big-title" animated>Success!</Heading>
        <p>Your new account has been created.<br>If you will store significant value in this account, please make a backup now.</p>
        <router-link :to="{ name: 'account-details' }" class="text-link">Skip</router-link>
      </div>
    </InvertedColors>
    <template #footer>
      <div class="content">
        <ButtonGroup vertical>
          <Button type="secondary">Backup Recovery Phrase</Button>
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
export default class AccountCreated extends Vue {
}
</script>

<style lang="scss">
.account-created-content {
  background-color: #1b1b1b;
  color: #fff;
  min-height: 100%;
}
.big-title {
  font-size: (36/16)*1rem;
  font-weight: 600;
}
</style>