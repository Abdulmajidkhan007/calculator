const DISPLAY_OPERATORS = new Set(['+', '−', '×', '÷']);

export function lastChar(expr: string): string {
  return expr[expr.length - 1] ?? '';
}

export function endsWithOperator(expr: string): boolean {
  return DISPLAY_OPERATORS.has(lastChar(expr));
}

export function endsWithNumber(expr: string): boolean {
  return /\d/.test(lastChar(expr));
}

export function endsWithCloseParen(expr: string): boolean {
  return lastChar(expr) === ')';
}

export function endsWithDot(expr: string): boolean {
  return lastChar(expr) === '.';
}

export function countOpenParens(expr: string): number {
  let count = 0;
  for (const ch of expr) {
    if (ch === '(') count++;
    else if (ch === ')') count--;
  }
  return count;
}

/** Decide whether the next paren tap should insert '(' or ')'. */
export function smartParen(expr: string): string {
  if (!expr) return '(';
  const last = lastChar(expr);
  const open = countOpenParens(expr);

  // After operator, opening paren, or at the start → open
  if (DISPLAY_OPERATORS.has(last) || last === '(') return '(';

  // If there are open parens and last char is a digit or close paren → close
  if (open > 0 && (endsWithNumber(expr) || endsWithCloseParen(expr))) return ')';

  return '(';
}

/** True if adding a decimal point to the current trailing number is legal. */
export function canAddDecimal(expr: string): boolean {
  // Walk back from end to find current number segment
  let i = expr.length - 1;
  while (i >= 0 && (expr[i] >= '0' && expr[i] <= '9')) i--;
  const segment = expr.slice(i + 1);
  // Only block if this segment already has a dot
  const prefixHasDot = (() => {
    let j = i;
    while (j >= 0 && expr[j] !== '+' && expr[j] !== '−' && expr[j] !== '×' && expr[j] !== '÷' && expr[j] !== '(') {
      if (expr[j] === '.') return true;
      j--;
    }
    return false;
  })();
  return !prefixHasDot && !segment.includes('.');
}

/** Replace the last operator character in the expression. */
export function replaceLastOperator(expr: string, newOp: string): string {
  if (!expr) return newOp;
  if (DISPLAY_OPERATORS.has(lastChar(expr))) {
    return expr.slice(0, -1) + newOp;
  }
  return expr + newOp;
}

/** Negate the last number in the expression. */
export function negateLastNumber(expr: string): string {
  if (!expr) return '-';

  // Match trailing number (possibly with decimal)
  const match = expr.match(/(.*?)(-?\d+\.?\d*)$/);
  if (!match) return expr;

  const prefix = match[1];
  const numStr = match[2];

  if (numStr.startsWith('-')) {
    return prefix + numStr.slice(1);
  }

  // Check if prefix ends with an operator — safe to insert minus after it
  const prefixLast = prefix[prefix.length - 1] ?? '';
  if (!prefix || DISPLAY_OPERATORS.has(prefixLast) || prefixLast === '(') {
    return prefix + '-' + numStr;
  }

  // Beginning of expression or isolated number
  return '-' + numStr;
}

/** Apply percent to the last number in the expression. */
export function applyPercent(expr: string): string {
  if (!expr) return expr;
  if (endsWithNumber(expr) || endsWithCloseParen(expr)) {
    return expr + '%';
  }
  return expr;
}
