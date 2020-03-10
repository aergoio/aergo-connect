import { storiesOf } from '@storybook/vue';
import ModalDialog from '../layouts/ModalDialog.vue';
import { Button } from '../buttons';

storiesOf('Layouts/ModalDialog', module)
  .add('basic', () => ({
    components: { ModalDialog, Button, },
    data() {
        return { visible: false, }
    },
    template: `
      <div style="width: 280px; height: 380px; border-radius: 8px; box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0.08); position: relative; overflow: hidden">
        <div class="content"><Button @click="visible=!visible">Show modal</Button></div>
        <ModalDialog :visible="visible" @close="visible=false">
          <div class="content">
          Hello Modal
          </div>
        </ModalDialog>
      </div>
`,
  }))