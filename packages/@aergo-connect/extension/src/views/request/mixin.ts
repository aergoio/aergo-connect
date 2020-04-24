
import Vue from 'vue';
import Component from 'vue-class-component'
import { ExternalRequest } from '../../background/request';

/**
 * Mixin with common code from Request views.
 * Handles confirm, cancel, and status (loading/error message)
 */
@Component
export class RequestMixin extends Vue {
  request: ExternalRequest | null = null;
  statusText = '';
  statusDialogVisible = false;
  dialogState: 'loading' | 'success' | 'error' = 'loading';

  get requestId() {
    return this.$store.state.request.currentRequestId;
  }

  async mounted() {
    this.request = await this.$store.dispatch('request/getRequest');
  }

  setStatus(state: 'loading' | 'success' | 'error', text: string) {
    this.dialogState = state;
    this.statusText = text;
    this.statusDialogVisible = true;
  }

  async confirmHandler(): Promise<any> {
    throw new Error('not implemented');
  }

  async confirm() {
    if (!this.request || !this.requestId) return;
    try {
      const result = await this.confirmHandler();
      this.setStatus('success', 'Done');
      await this.$background.respondToPermissionRequest({ requestId: this.requestId, result });
      window.setTimeout(() => {
        window.close();
      }, 1000);
    } catch (e) {
      this.setStatus('error', `${e}`);
    }
  }

  async cancel() {
    await this.$background.denyPermissionRequest(this.requestId);
    window.close();
  }
}
