const tuple = <T extends string[]>(...args: T) => args;

export const InputVariants = tuple('default', 'main');
export type InputVariant = typeof InputVariants[number];

export const InputTypes = tuple('text', 'password', 'number', 'file');
export type InputType = typeof InputTypes[number];

export const InputStates = tuple('default', 'loading', 'invalid', 'valid');
export type InputState = typeof InputStates[number];

export interface InputProps {
  variant?: InputVariant;
  type?: InputType;
  error?: string;
  disabled?: boolean;
  state?: InputState;
}

export interface OptionDict {
  value: string | number;
  label: string;
  icon?: string;
}

type SelectOptionWithLabel = [string, string];
export type SelectOption = string | SelectOptionWithLabel | OptionDict;
// eslint-disable-next-line
export function isSelectOptionWithLabel(option: any): option is SelectOptionWithLabel {
  return typeof option === 'object' && option.length === 2;
}
// eslint-disable-next-line
export function isSelectOptionObject(option: any): option is OptionDict {
  return typeof option === 'object' && typeof option.value !== 'undefined';
}


