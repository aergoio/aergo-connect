<template>
  <ScrollView class="page"> 
    <div class="content">
      <div class="icon-header">
        <Icon name="title-trash" :size="36" />
      </div>
      <Heading>Remove account</Heading>
      <p>
        This will remove access to this account in this wallet. Make sure you have a backup or don't need this account anymore.
      </p>
    </div>

    <template #footer>
      <div class="content">
        <ButtonGroup horizontal>
          <Button type="secondary" :to="{ name: 'account-list' }">Cancel</Button>
          <Button type="primary" @click="confirm">Confirm</Button>
        </ButtonGroup>
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Button, ButtonGroup, ContinueButton } from '@aergo-connect/lib-ui/src/buttons';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';

@Component({
  components: {
    ScrollView,
    Button,
    ContinueButton,
    ButtonGroup,
    Heading,
    Icon,
  },
})
export default class RequestAddress extends mixins() {
  async confirm() {
    // Better double check
    const nativeCheck = confirm(`Are you really sure you want to remove the account ${this.$route.params.address} from this wallet?`);
    if (!nativeCheck) return;
    await this.$background.removeAccount({
      chainId: this.$route.params.chainId,
      address: this.$route.params.address,
    })
    this.$router.push({ name: 'accounts-list' });
  }
}
</script>