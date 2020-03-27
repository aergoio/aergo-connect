<template>
  <ScrollView class="page">
    <InvertedColors class="account-imported-content">
      <div class="content">
        <div class="success-header">
          <SuccessIcon />
          <Heading class="semi-big-title">Success!</Heading>
        </div>
        <p class="import-success-text">Your account has been imported.</p>
      </div>
    </InvertedColors>
    <template #footer>
      <div class="footer-content">
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
import { SuccessIcon } from '@aergo-connect/lib-ui/src/icons';
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
    SuccessIcon,
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
  padding-top: 40px;
  box-sizing: border-box;
}
.import-success-text {
  margin-top: 10px;
  text-align: center;
  color: rgba(#fff, 0.8);
}
</style>