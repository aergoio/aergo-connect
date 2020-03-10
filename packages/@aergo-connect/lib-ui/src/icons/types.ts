const tuple = <T extends string[]>(...args: T) => args;

export const iconNames = tuple(
  'add-name',
  'add',
  'back',
  'checkmark',
  'checkmark-circle',
  'close',
  'dropdown',
  'link',
  'logo',
  'next',
  'tab-history',
  'tab-send',
  'tab-wallet',
  'title-network',
  'title-request',
  'title-security',
  'tx-in',
  'tx-out',
  'tx-self',
);
  
export type IconName = typeof iconNames[number];
  