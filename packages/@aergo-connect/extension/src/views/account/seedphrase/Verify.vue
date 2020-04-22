<template>
  <ScrollView class="page">
    <div class="content" style="padding-bottom: 0">
      <Heading>Verify recovery phrase</Heading>
      <p>
        Enter the words below to make sure you've stored your recovery phrase correctly.
      </p>
      <TextField
        v-for="(wordIndex, index) in verifyWordIndices" :key="index"
        :label="`${nth(wordIndex+1)} word`"
        v-model="words[index]"
        :state="words[index].trim() === seedPhraseWords[wordIndex].trim() ? 'valid' : 'default'"
      />
    </div>
    <template #footer>
      <div class="content">
        <ContinueButton :to="{ name: 'account-seedphrase-verify' }" :disabled="!verified" />
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { ContinueButton } from '@aergo-connect/lib-ui/src/buttons';
import { TextField } from '@aergo-connect/lib-ui/src/forms';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import { Identicon } from '@aergo-connect/lib-ui/src/content';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import InvertedColors from '@aergo-connect/lib-ui/src/theme/InvertedColors.vue'; 

import Vue from 'vue';
import Component from 'vue-class-component';

const nth = (n: number): string => ["st","nd","rd"][((n+90)%100-10)%10-1]||"th";

@Component({
  components: {
    ScrollView,
    Heading,
    InvertedColors,
    Identicon,
    Icon,
    TextField,
    ContinueButton,
  },
})
export default class ViewSeedPhrase extends Vue {
  numWords = 3;
  words = ['', '', ''] as const;

  get verifyWordIndices(): number[] {
    const shuffled = [...Array(12).keys()].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, this.numWords);
  }

  get seedPhrase(): string {
    return 'foo foo foo foo foo foo foo foo foo foo foo foo';
    return this.$store.state.accounts.lastSeedPhrase;
  }

  get seedPhraseWords(): string[] {
    if (this.seedPhrase) {
      return this.seedPhrase.split(' ');
    }
    return [];
  }

  get verified(): boolean {
    return this.verifyWordIndices.every((wordIndex, index) => this.words[index].trim() === this.seedPhraseWords[wordIndex].trim());
  }

  nth(n: number) {
    return `${n}${nth(n)}`;
  }
}
</script>