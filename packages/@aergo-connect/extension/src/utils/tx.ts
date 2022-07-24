import { Tx } from "@herajs/client";
import { capitalizeFirstLetter } from "./strings";

export function typeToLabel(type: keyof typeof Tx.Type) {
  if (type === 'FEEDELEGATION') {
    return 'Call with fee delegation';
  }
  if (type === 'NORMAL') {
    return 'Normal (legacy)';
  }
  if (type === 'MULTICALL') {
    return 'Multiple Call';
  }
  return capitalizeFirstLetter(type.toLowerCase());
}