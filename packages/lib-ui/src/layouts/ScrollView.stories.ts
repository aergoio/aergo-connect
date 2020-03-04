import { storiesOf } from '@storybook/vue';
import ScrollView from './ScrollView.vue';
import InvertedColors from '../theme/InvertedColors.vue';

storiesOf('Layouts/ScrollView', module)
  .add('basic', () => ({
    components: { ScrollView },
    template: `
      <div style="width: 250px; height: 350px; border: 1px solid #ccc;">
        <ScrollView>
          <template #header>
          Header Content (optional)
          </template>

          <div style="padding: 10px">
            Scroll view content
            <div style="height: 545px"></div>
            Hello
          </div>
          
          <template #footer>
          Footer Content (optional)
          </template>
        </ScrollView>
      </div>
`,
  }))
  .add('with little content', () => ({
    components: { ScrollView },
    template: `
      <div style="width: 250px; height: 350px; border: 1px solid #ccc;">
        <ScrollView>
          <template #header>
          Header Content (optional)
          </template>

          <div style="padding: 10px">
            Content fits, so no scrolling
          </div>
          
          <template #footer>
          Footer Content (optional)
          </template>
        </ScrollView>
      </div>
`,
  }))
  .add('with nested scroll view', () => ({
    components: { ScrollView },
    template: `
      <div style="width: 250px; height: 350px; border: 1px solid #ccc;">
        <ScrollView>
          <div style="padding: 10px; height: 100%; box-sizing: border-box;">
            <ScrollView style="background-color: #f0f0f0; border-radius: 5px;">
              <div style="padding: 10px;">
                Nested scroll view.<br>
                Use this to if you need scrollbars inside another box.
                <div style="height: 345px"></div>
                Hello
             </div>
            </ScrollView>
          </div>
          
          <template #footer>
          Footer Content
          </template>
        </ScrollView>
      </div>
`,
  }))
  .add('inverted colors', () => ({
    components: { ScrollView, InvertedColors },
    template: `
      <InvertedColors style="width: 250px; height: 350px; border: 1px solid #ccc; background: #111; color: #fff;">
        <ScrollView>
          <div style="padding: 10px">
            Scroll view content
            <div style="height: 345px"></div>
            Hello
          </div>
          
          <template #footer>
          Footer Content
          </template>
        </ScrollView>
      </InvertedColors>
`,
  }))