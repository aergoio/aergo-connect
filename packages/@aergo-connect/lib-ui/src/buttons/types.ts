const tuple = <T extends string[]>(...args: T) => args;

export const ButtonTypes = tuple('default', 'primary', 'secondary', 'danger');
export type ButtonType = typeof ButtonTypes[number];

export const ButtonSizes = tuple('default');
export type ButtonSize = typeof ButtonSizes[number];

export interface ButtonProps {
  type?: ButtonType;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
}