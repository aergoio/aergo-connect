<template>
  <ScrollView class="page">
    <div class="content">
      <section class="dialog-header">
        <BackButton :to="{ name: 'account-import' }" />
      </section>
      <Heading>Import Format</Heading>
      <p>Please select the import format.</p>
      <p>
        <ButtonGroup vertical>
          <Button type="primary" :to="{ name: 'account-import-keystore' } ">Keystore File</Button>
          <Button>Encrypted String</Button>
        </ButtonGroup>
      </p>
      <p class="note">‘Keystore File’ is the recommended format. Use it when you saved your key as an encrypted file.</p>
      <p class="note">‘Import String’ is a legacy format. Use it when you copied your key as an encrypted string.</p>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { BackButton, Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';

import Component, { mixins } from 'vue-class-component'

@Component({
  components: {
    ScrollView,
    BackButton,
    Heading,
    Button,
    ButtonGroup,
  },
})
export default class Import extends mixins() {
}
</script>

<style lang="scss">

</style>