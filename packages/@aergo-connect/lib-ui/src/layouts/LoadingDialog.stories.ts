import { storiesOf } from '@storybook/vue';
import LoadingDialog from '../layouts/LoadingDialog.vue';
import { Button } from '../buttons';
import { select } from '@storybook/addon-knobs';

storiesOf('Layouts/LoadingDialog', module)
  .add('basic', () => ({
    components: { LoadingDialog, Button, },
    data() {
        return { visible: false, }
    },
    props: {
      state: {
        default: select('state', ['loading', 'success', 'error'], 'loading'),
      },
    },
    template: `
      <div style="width: 280px; height: 380px; border-radius: 8px; box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0.08); position: relative; overflow: hidden">
        <div class="content"><Button @click="visible=!visible">Show modal</Button></div>
        <LoadingDialog :visible="visible" @close="visible=false" title="Loading" :state="state">
          <p v-if="state !== 'error'">Calculating splines...</p>
          <p v-else class="error">Error message</p>
        </LoadingDialog>
      </div>
`,
  }))