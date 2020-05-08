<template>
  <div class="account-list-view">
    <ScrollView>
      <template #header>
        <div class="account-list-header">
          <BackButton />
          <Heading tag="h2">
            {{chainIdReadonly ? 'Update' : 'Add' }} custom network
          </Heading>
        </div>
      </template>
      <div class="content">
        <TextField label="Chain ID" v-model="chainId" :state="chainIdValid ? 'valid' : 'initial'" :disabled="chainIdReadonly" />
        <TextField label="Node URL (http://... or https://...)" v-model="nodeUrl" :state="nodeUrlTested ? 'valid' : nodeUrlValid && !nodeUrlError ? 'loading' : 'initial'" :error="nodeUrlError" />
      </div>
      <template #footer>
        <div class="content">
          <ButtonGroup horizontal>
            <Button type="primary" :disabled="!canSave" @click="save">Save</Button>
          </ButtonGroup>
        </div>
      </template>
    </ScrollView>
  </div>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { Button, BackButton, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { TextField } from '@aergo-connect/lib-ui/src/forms';

import { Vue, Component, Watch } from 'vue-property-decorator';
import AergoClient, { GrpcWebProvider } from '@herajs/client';

@Component({
  components: {
    ScrollView,
    Heading,
    ButtonGroup,
    Button,
    BackButton,
    TextField,
  },
})
export default class NetworkUpdate extends Vue {
  chainId = "";
  chainIdReadonly = false;
  nodeUrl = "";
  nodeTestTimeout: NodeJS.Timeout | null = null;
  nodeUrlTested = false;
  nodeUrlError = '';

  get chainIdValid() {
    return this.chainId.length > 0 && this.chainId.match(/^[a-z0-9._]+$/i)
  }
  get nodeUrlValid() {
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    return this.nodeUrl.length > 0 && this.nodeUrl.match(urlRegex);
  }
  get canSave() {
    return this.chainIdValid && this.nodeUrlTested;
  }

  async mounted() {
    if (this.$route.params.chainId) {
      // Load existing chain data for update
      this.chainId = this.$route.params.chainId;
      this.nodeUrl = 'Loading...';
      const chains = await this.$background.getNetworks();
      const chain = chains[this.chainId] as any;
      this.nodeUrl = chain['nodeUrl'];
      this.chainIdReadonly = true;
    }
  }

  @Watch('nodeUrl')
  onNodeUrlChanged() {
    if (this.nodeTestTimeout) {
      clearTimeout(this.nodeTestTimeout);
    }
    this.nodeUrlTested = false;
    this.nodeUrlError = '';
    if (!this.nodeUrlValid) return;
    this.nodeTestTimeout = setTimeout(() => {
      this.testNodeConnection();
    }, 1000);
  }

  async testNodeConnection() {
    const aergo = new AergoClient({}, new GrpcWebProvider({ url: this.nodeUrl }));
    try {
      await aergo.blockchain();
      this.nodeUrlTested = true;
    } catch (e) {
      console.log(e);
      this.nodeUrlError = `${e}`;
    }
  }

  async save() {
    await this.$background.addNetwork({
      chainId: this.chainId,
      nodeUrl: this.nodeUrl,
    });
    this.$router.back();
  }
}
</script>

<style lang="scss">
.account-list-view {
  height: 100%;
  box-sizing: border-box;
}
.account-list-header {
  border-bottom: 1px solid #f2f2f2;
  padding: 0 20px;
}
.account-list-wrap {
  border-radius: 2px;
  box-shadow: 0 12px 20px 0 rgba(34, 34, 34, 0.08);
  margin: 20px 20px 25px 20px;
}
</style>