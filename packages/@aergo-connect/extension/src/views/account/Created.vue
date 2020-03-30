<template>
  <ScrollView class="page">
    <InvertedColors class="account-created-content">
      <div class="content">
        <Heading class="semi-big-title" animated>Success!</Heading>
        <p>Your new account has been created.<br>If you will store significant value in this account, please make a backup now.</p>
        <div class="new-account-box">
          <Identicon :text="$route.params.address" />
          <div class="new-account-address">
            <span>{{$route.params.address}}</span>
            <ClipboardButton :value="$route.params.address" />
          </div>
        </div>
      </div>
    </InvertedColors>
    <template #footer>
      <div class="footer-content">
        <ButtonGroup vertical>
          <Button type="secondary">Backup Recovery Phrase</Button>
        </ButtonGroup>
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { Button, ButtonGroup, ClipboardButton } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import { Identicon } from '@aergo-connect/lib-ui/src/content';
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
    Identicon,
    Icon,
    ClipboardButton,
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
.new-account-box {
  border-radius: 24px;
  box-shadow: 0 12px 12px 0 rgba(0, 0, 0, 0.04);
  background-color: #272727;
  padding: 20px 25px 25px;
  display: flex;
  align-items: center;
  flex-direction: column;

  .identicon {
    width: 130px;
    height: 130px;
  }

  .new-account-address {
    display: flex;
    align-items: center;

    font-size: (13/16)*1rem;
    padding-top: 24px;
    margin-top: 20px;
    border-top: 1px solid #1b1b1b;
    word-break: break-all;

    .copy-button {
      margin-left: 10px;
    }
  }
}
</style>