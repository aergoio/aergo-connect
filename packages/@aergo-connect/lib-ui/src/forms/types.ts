const tuple = <T extends string[]>(...args: T) => args;

export const InputVariants = tuple('default', 'main');
export type InputVariant = typeof InputVariants[number];

export const InputTypes = tuple('text', 'password', 'number');
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

type SelectOptionWithLabel = [string, string];
export type SelectOption = string | SelectOptionWithLabel;
export function isSelectOptionWithLabel(option: any): option is SelectOptionWithLabel {
  return typeof option === 'object' && option.length === 2;
}