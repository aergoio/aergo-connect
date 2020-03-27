<template>
  <ScrollView class="page">
    <div class="content">
      <section class="dialog-header">
        <Icon name="title-security" :size="35" />
      </section>
      <Heading animated>Set your passphrase</Heading>
      <p>To get started, please configure a passphrase for your wallet. This passphrase will be used to secure all your accounts.</p>
      <TextField variant="main" type="password" v-model="password" :error="errors.password" />
    </div>
    <template #footer>
      <div class="content">
        <ContinueButton @click="setup" :disabled="!canContinue" />
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { ContinueButton } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { TextField } from '@aergo-connect/lib-ui/src/forms';
import { Icon } from '@aergo-connect/lib-ui/src/icons';

import Component, { mixins } from 'vue-class-component'

@Component({
  components: {
    ScrollView,
    Heading,
    TextField,
    ContinueButton,
    Icon,
  },
})
export default class Setup extends mixins() {
  password = "";
  errors = {
    password: "",
  };

  next() {
    this.$router.push({ name: this.$route.params.next || 'account-create' });
  }

  async beforeMount(): Promise<void> {
    const isSetup = await this.$background.isSetup();
    if (isSetup) {
      this.next();
    }
  }

  get canContinue(): boolean {
    return Boolean(this.password);
  }

  async setup() {
    const check = await this.$background.setup({
      password: this.password,
    });
    if (check) {
      this.next();
    }
  }
}
</script>

<style lang="scss">

</style>