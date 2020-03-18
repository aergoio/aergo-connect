import { Amount } from '@herajs/client';

interface NumberLike {
  toString: () => string;
}

/**
 * Add thousands seperators to string of number
 * @param value number-like value that has a toString() method
 * @param sep seperator for 10^3, default: space
 * @param sepDecimal seperator for 10^-3, default: empty
 */
export function formatNumber(value: NumberLike, sep=' ', sepDecimal=''): string {
  const parts = value.toString().split('.');
  // Add seperators from the right
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  if (parts.length > 1 && sepDecimal) {
    // Reverse decimal part to add seperators from the left
    const rev = (s: string): string => s.split('').reverse().join('');
    parts[1] = rev(rev(parts[1]).replace(/\B(?=(\d{3})+(?!\d))/g, sepDecimal));
  }
  return parts.join('.');
}

const tryUnits = ['aergo', 'gaer', 'aer'];

export function formatToken(_value: string, unit: string|null = null) {
    const value = new Amount(_value);
    let amount;
    if (unit) {
        [amount] = value.toUnit(unit).toString().split(' ');
    } else {
        // if no unit given, try formatting from biggest to smallest
        let i = 0;
        do {
            unit = tryUnits[i++];
            [amount] = value.toUnit(unit).toString().split(' ');
            // try next smaller unit if too many leading zeros
        } while (i < tryUnits.length && amount.match(/^0\.0{3,}/))
    }
    if (!amount) {
        amount = '0';
    }

    // Insert spaces for formatting
    let display = formatNumber(amount, ' ', ' ');
    // Turn spaces into html to not mess up copy and paste
    display = display.replace(/\s/g, '<span class="sep"></span>');
    // Add class for decimal point
    display = display.replace('.', '<span class="point">.</span>');

    const displayHtml = `<span class="value">${display}</span>`;
    const unitHtml = `<span class="unit">${unit}</span>`;
    return `<span class="formatted-value token" title="${value}">${displayHtml} ${unitHtml}</span>`;
}