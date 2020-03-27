<template>
  <ScrollView class="page">
    <div class="locked-content">
      <Icon name="title-security" :size="36" />
      <Heading>Your wallet is locked.</Heading>
      <p>Please enter your wallet passphrase to continue.</p>
      <TextField variant="main" type="password" v-model="password" :error="errors.password" @submit="unlock" />
    </div>

    <template #footer>
      <div class="content">
        <ContinueButton @click="unlock" :disabled="!canContinue" />
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
import Appear from '@aergo-connect/lib-ui/src/animations/Appear.vue';
import { TextField } from '@aergo-connect/lib-ui/src/forms';

@Component({
  components: {
    ScrollView,
    Button,
    ContinueButton,
    ButtonGroup,
    Heading,
    Appear,
    TextField,
    Icon,
  },
})
export default class Lockscreen extends mixins() {
  password = "";
  errors = {
    password: "",
  };

  async beforeMount(): Promise<void> {
    const isSetup = await this.$background.isSetup();
    if (!isSetup) {
      this.$router.push({ name: 'welcome' });
    }
  }

  get canContinue(): boolean {
    return Boolean(this.password);
  }

  async unlock(): Promise<void> {
    try {
      await this.$background.unlock({ password: this.password });
      let nextPath = this.$store.state.ui.route.currentPath;
      if (!nextPath || nextPath === '/' || nextPath === '/locked') {
        nextPath = { name: 'accounts-list' };
      }
      this.$router.push(nextPath);
    } catch(e) {
      this.errors.password = `${e}`;
    }
  }
}

</script>

<style lang="scss">
.locked-content {
  margin-top: 15px;
  padding: 20px;

  .icon {
    margin-bottom: 15px;
  }
}
</style>