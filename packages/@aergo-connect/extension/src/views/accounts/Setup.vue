<template>
  <ScrollView class="page">
    <div class="content">
      <section class="dialog-header">
        <Icon name="title-security" :size="35" />
      </section>
      <div v-if="step === 'initial'">
        <Heading animated>Set your passphrase</Heading>
        <p>To get started, please configure a passphrase for your wallet. This passphrase will be used to secure all your accounts.</p>
        <PasswordStrengthField variant="main" v-model="password" @submit="nextStep" autofocus />
      </div>
      <div v-if="step === 'repeat'">
        <Heading>Repeat passphrase</Heading>
        <p>Please retype your passphrase for confirmation.</p>
        <TextField variant="main" type="password"
        v-model="passwordRepeat" @submit="nextStep"
        :error="validateRepeat && passwordRepeat !== password ? 'Does not match': ''" :state="passwordRepeat === password ? 'valid' : 'initial'" autofocus />
      </div>
    </div>
    <template #footer>
      <div class="content">
        <ButtonGroup horizontal>
          <BackButton v-if="step === 'repeat'" :onClick="() => step = 'initial'" />
          <ContinueButton @click="nextStep" :disabled="!canContinue" />
        </ButtonGroup>
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { ContinueButton, BackButton, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { TextField, PasswordStrengthField } from '@aergo-connect/lib-ui/src/forms';
import { Icon } from '@aergo-connect/lib-ui/src/icons';

import Component, { mixins } from 'vue-class-component';

@Component({
  components: {
    ScrollView,
    Heading,
    PasswordStrengthField,
    TextField,
    ContinueButton,
    ButtonGroup,
    BackButton,
    Icon,
  },
})
export default class Setup extends mixins() {
  password = '';
  passwordRepeat = '';
  step: 'initial' | 'repeat' = 'initial';
  validateRepeat = false;

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
    return Boolean(this.step === 'initial' && this.password || this.step === 'repeat' && this.passwordRepeat === this.password);
  }

  nextStep() {
    if (this.step === 'initial') {
      this.step = 'repeat';
    }
    else if (this.step === 'repeat') {
      if (this.passwordRepeat === this.password) {
        this.setup();
      } else {
        this.validateRepeat = true;
      }
    }
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