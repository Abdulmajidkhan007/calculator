const MAX_DISPLAY_DIGITS = 10;

export function formatResult(value: number): string {
  if (!isFinite(value)) return 'Error';
  if (isNaN(value)) return 'Error';

  // Handle very large or very small numbers with scientific notation
  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1e12 || abs < 1e-7)) {
    return value.toExponential(4).replace('e+', 'e').replace('e0', '');
  }

  // Round to avoid floating point artifacts (e.g. 0.1 + 0.2 = 0.30000000000000004)
  const rounded = parseFloat(value.toPrecision(12));

  const str = rounded.toString();

  // If it has a decimal, trim trailing zeros but keep up to MAX_DISPLAY_DIGITS significant digits
  if (str.includes('.')) {
    const parts = str.split('.');
    const intPart = parts[0];
    const decPart = parts[1].replace(/0+$/, ''); // trim trailing zeros

    const totalDigits = intPart.replace('-', '').length + decPart.length;
    if (totalDigits > MAX_DISPLAY_DIGITS) {
      const allowedDec = Math.max(0, MAX_DISPLAY_DIGITS - intPart.replace('-', '').length);
      const trimmed = parseFloat(rounded.toFixed(allowedDec)).toString();
      return addThousandsSeparator(trimmed);
    }

    const result = decPart ? `${intPart}.${decPart}` : intPart;
    return addThousandsSeparator(result);
  }

  return addThousandsSeparator(str);
}

function addThousandsSeparator(numStr: string): string {
  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function formatDisplay(text: string): string {
  // Apply thousands separator to the display number if it's just a plain number
  if (/^-?\d+$/.test(text) && text.length > 3) {
    return addThousandsSeparator(text);
  }
  return text;
}

export function getDisplayFontSize(text: string, baseSize: number): number {
  const len = text.replace(/,/g, '').length;
  if (len <= 7) return baseSize;
  if (len <= 9) return baseSize * 0.82;
  if (len <= 11) return baseSize * 0.68;
  return baseSize * 0.55;
}

export function getExpressionFontSize(text: string, baseSize: number): number {
  const len = text.length;
  if (len <= 14) return baseSize;
  if (len <= 20) return baseSize * 0.88;
  if (len <= 26) return baseSize * 0.76;
  return baseSize * 0.65;
}
