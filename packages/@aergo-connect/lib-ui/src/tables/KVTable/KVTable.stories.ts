import { storiesOf } from '@storybook/vue';
import { KVTable, KVTableRow } from '..';
import InvertedColors from '../../theme/InvertedColors.vue';

const kvData = {
  'Block Number': '<a href=\'\'>662288</a>',
  'From': 'AmPecz2AYMGC54ZW5VeSwtmV2PeYAEHiz6PNRxbLqyGeaNZJP84E',
  'To': 'AmQLSEi7oeW9LztxGa8pXKQDrenzK2JdDrXsJoCAh6PXyzdBtnVJ',
  'Timestamp': 'Friday, May 17th 2020, 17:25:04 (2 minutes ago)',
  'Amount': '0 aergo',
  'Fee': '0.123123 aergo',
  'Nonce': '123',
  'Timestamp More': 'Friday, May 17th 2020, 17:25:04 (2 minutes ago)',
  'Payload with a long label': '2312 bytes',
  'Payload with a very very very long label': 'Friday, May 17th 2020, 17:25:04 (2 minutes ago)',
};

storiesOf('Tables/Key-value table', module)
  .addParameters({
    backgrounds: [
      { name: 'light', value: '#fafafa', default: true },
      { name: 'dark', value: '#222222' },
    ],
  })
  .add('basic', () => ({
    components: { KVTable, KVTableRow },
    template: `<div style="max-width: 400px">
      <KVTable>
        ${Object.entries(kvData).map(
          ([key, value]) => `<KVTableRow label="${key}" textEllipsis>${value}</KVTableRow>`,
        ).join('')}
      </KVTable>
    </div>`,
    methods: {},
  }))
  .add('inverted', () => ({
    components: { KVTable, KVTableRow, InvertedColors },
    template: `<InvertedColors>
    <div style="max-width: 400px">
      <KVTable>
        ${Object.entries(kvData).map(
          ([key, value]) => `<KVTableRow label="${key}" textEllipsis>${value}</KVTableRow>`,
        ).join('')}
      </KVTable>
    </div>
    </InvertedColors>`,
    methods: {},
  }))
