const tuple = <T extends string[]>(...args: T) => args;

export const iconNames = tuple(
  'account-create',
  'account-connect',
  'account-export',
  'account-import',
  'add-name',
  'add',
  'back',
  'checkmark',
  'checkmark-circle',
  'close',
  'danger',
  'danger-big',
  'dropdown',
  'link',
  'logo',
  'network-other',
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
  