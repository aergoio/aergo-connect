<template>
  <ScrollView class="page">
    <div class="content">
      <Heading>Recovery phrase</Heading>
      <p>
        For a safe backup, write down this recovery phrase on paper.
        You need to verify it in the next step.
      </p>
      <p v-if="!seedPhrase" class="input-error-text">The seed phrase is no longer available because you reloaded the page after creating the account. Please create a new account.</p>
      <div class="seed-phrase" v-if="seedPhrase">
        <span class="word" v-for="word in seedPhraseWords" :key="word">{{word}}</span>
      </div>
    </div>
    <template #footer>
      <div class="content">
        <ContinueButton v-if="seedPhrase" :to="{ name: 'account-seedphrase-verify' }" />
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { ContinueButton } from '@aergo-connect/lib-ui/src/buttons';
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
    InvertedColors,
    Identicon,
    Icon,
    ContinueButton,
  },
})
export default class ViewSeedPhrase extends Vue {
  get seedPhrase(): string {
    return 'foo bar baz';
    return this.$store.state.accounts.lastSeedPhrase;
  }
  get seedPhraseWords(): string[] {
    if (this.seedPhrase) {
      return this.seedPhrase.split(' ');
    }
    return [];
  }
}
</script>

<style lang="scss">
.seed-phrase {
  line-height: 52px;
  counter-reset: wordIndex;
  font-size: (14/16)*1rem;

  .word {
    display: inline-block;
    background-color: #d9d9d9;
    padding: 0 20px;
    border-radius: 26px;
    margin: 0 8px 8px 0;
    font-weight: 500;

    &:before {
      counter-increment: wordIndex;
      content: "" counter(wordIndex) ". ";
      color: #777;
    }
  }
}
</style>