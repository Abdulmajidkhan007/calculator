/**
 * Safe expression evaluator using the Shunting-Yard algorithm.
 * Never uses eval() — parses and computes the RPN stack directly.
 */

type Op = '+' | '-' | '*' | '/';

function precedence(op: Op): number {
  return op === '+' || op === '-' ? 1 : 2;
}

function applyOp(op: Op, a: number, b: number): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? Infinity : a / b;
  }
}

function normalize(expression: string): string {
  return expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/,/g, '')
    .replace(/\s+/g, '');
}

// Handle percentage: replace N% with (N/100), e.g. 50% → (50/100)
function resolvePercent(expr: string): string {
  return expr.replace(/(\d+\.?\d*)\%/g, '($1/100)');
}

export function evaluate(expression: string): { value: number; error: boolean } {
  try {
    const normalized = resolvePercent(normalize(expression));
    if (!normalized || normalized === '' || normalized === '-') {
      return { value: 0, error: false };
    }

    const value = parseExpression(normalized);

    if (!isFinite(value) && !isNaN(value)) {
      // Infinity from divide by zero
      return { value: Infinity, error: true };
    }
    if (isNaN(value)) {
      return { value: 0, error: true };
    }

    return { value, error: false };
  } catch {
    return { value: 0, error: true };
  }
}

function parseExpression(expr: string): number {
  const values: number[] = [];
  const ops: Op[] = [];
  let i = 0;

  const applyTop = () => {
    const b = values.pop()!;
    const a = values.pop()!;
    values.push(applyOp(ops.pop()!, a, b));
  };

  while (i < expr.length) {
    const ch = expr[i];

    if (ch === ' ') { i++; continue; }

    // Parse a number (including leading minus for unary negation)
    if (
      (ch >= '0' && ch <= '9') ||
      ch === '.' ||
      (ch === '-' && (i === 0 || expr[i - 1] === '(' || isOperatorChar(expr[i - 1])))
    ) {
      let numStr = ch === '-' ? '-' : '';
      if (ch === '-') i++;
      while (
        i < expr.length &&
        ((expr[i] >= '0' && expr[i] <= '9') || expr[i] === '.')
      ) {
        numStr += expr[i++];
      }
      if (numStr === '' || numStr === '-' || numStr === '.') {
        throw new Error('Invalid number');
      }
      values.push(parseFloat(numStr));
      continue;
    }

    if (ch === '(') {
      ops.push(ch as unknown as Op);
      i++;
      continue;
    }

    if (ch === ')') {
      while (ops.length > 0 && (ops[ops.length - 1] as unknown as string) !== '(') {
        applyTop();
      }
      if (ops.length === 0) throw new Error('Mismatched parentheses');
      ops.pop(); // remove '('
      i++;
      continue;
    }

    if (isOperatorChar(ch)) {
      const op = ch as Op;
      while (
        ops.length > 0 &&
        (ops[ops.length - 1] as unknown as string) !== '(' &&
        precedence(ops[ops.length - 1]) >= precedence(op)
      ) {
        applyTop();
      }
      ops.push(op);
      i++;
      continue;
    }

    throw new Error(`Unexpected character: ${ch}`);
  }

  while (ops.length > 0) {
    if ((ops[ops.length - 1] as unknown as string) === '(') {
      throw new Error('Mismatched parentheses');
    }
    applyTop();
  }

  if (values.length !== 1) throw new Error('Invalid expression');
  return values[0];
}

function isOperatorChar(ch: string): boolean {
  return ch === '+' || ch === '-' || ch === '*' || ch === '/';
}

/**
 * Attempt evaluation but return null if the expression is incomplete
 * (e.g. ends with an operator or open paren — not an error, just incomplete).
 */
export function tryEvaluate(expression: string): number | null {
  if (!expression || expression.trim() === '') return null;

  const trimmed = expression.trim();
  const lastChar = trimmed[trimmed.length - 1];

  // Incomplete expression: ends with operator or open paren
  if (['+', '−', '×', '÷', '('].includes(lastChar)) return null;

  const { value, error } = evaluate(trimmed);
  if (error) return null;
  return value;
}
