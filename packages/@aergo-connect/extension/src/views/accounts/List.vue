<template>
  <div>
    <ScrollView class="page">
      <div class="content">
        <Heading tag="h2">
          Accounts
          <Button @click="addAccountDialogVisible = true" type="icon"><Icon name="add" :size="24" /></Button>
        </Heading>
        <p><router-link :to="{ name: 'account-details', params: { chainId: 'aergo.io', address: 'AmgVbUZiReUVFXdYb4UVMru4ZqyicSsFPqumRx8LfwMKLFk66SNw' } }" class="text-link">Example</router-link></p>
        <p><router-link :to="{ name: 'welcome' }" class="text-link">Welcome view</router-link></p>
      </div>
    </ScrollView>

    <AddAccountDialog :visible="addAccountDialogVisible" @close="addAccountDialogVisible=false" />
  </div>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Button } from '@aergo-connect/lib-ui/src/buttons';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import AddAccountDialog from '../../components/accounts/AddAccountDialog.vue';

import Vue from 'vue';
import Component from 'vue-class-component'

@Component({
  components: {
    ScrollView,
    Heading,
    Button,
    Icon,
    AddAccountDialog,
  },
})
export default class AccountsList extends Vue {
  addAccountDialogVisible = false;
}
</script>

<style lang="scss">

</style>