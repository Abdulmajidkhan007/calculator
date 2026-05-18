import { useReducer, useCallback, useMemo } from 'react';
import { CalcAction, CalculatorState, ButtonKind } from '../types/calculator';
import { evaluate, tryEvaluate } from '../utils/mathEngine';
import { formatResult } from '../utils/numberFormat';
import {
  lastChar,
  endsWithOperator,
  endsWithNumber,
  endsWithCloseParen,
  endsWithDot,
  smartParen,
  canAddDecimal,
  replaceLastOperator,
  negateLastNumber,
  applyPercent,
  countOpenParens,
} from '../utils/expressionUtils';

const OPERATORS = new Set(['+', '−', '×', '÷']);

const INITIAL: CalculatorState = {
  expression: '',
  display: '0',
  liveResult: '',
  hasError: false,
  justEvaluated: false,
  openParens: 0,
  lastKind: null,
};

function computeLiveResult(expression: string): string {
  if (!expression || expression.length < 2) return '';
  const val = tryEvaluate(expression);
  if (val === null) return '';
  const formatted = formatResult(val);
  return formatted;
}

function reducer(state: CalculatorState, action: CalcAction): CalculatorState {
  switch (action.type) {
    case 'CLEAR':
      return { ...INITIAL };

    case 'BACKSPACE': {
      if (state.justEvaluated) return { ...INITIAL };
      if (!state.expression) return { ...INITIAL };

      const newExpr = state.expression.slice(0, -1);
      const live = computeLiveResult(newExpr);
      return {
        ...state,
        expression: newExpr,
        display: newExpr ? lastChar(newExpr) === '%' ? state.display : newExpr : '0',
        liveResult: live,
        hasError: false,
        openParens: countOpenParens(newExpr),
        lastKind: null,
        justEvaluated: false,
      };
    }

    case 'DIGIT': {
      const { digit } = action;

      // After evaluation, start fresh with the new digit
      if (state.justEvaluated) {
        const newExpr = digit;
        return {
          ...state,
          expression: newExpr,
          display: digit,
          liveResult: '',
          hasError: false,
          justEvaluated: false,
          lastKind: 'number',
        };
      }

      // Prevent more than one leading zero unless followed by decimal
      if (state.expression === '0' && digit === '0') return state;

      // After closing paren, implicit multiply: ) + digit → )×digit
      if (endsWithCloseParen(state.expression)) {
        const newExpr = state.expression + '×' + digit;
        return {
          ...state,
          expression: newExpr,
          display: digit,
          liveResult: computeLiveResult(newExpr),
          lastKind: 'number',
          justEvaluated: false,
        };
      }

      const newExpr = state.expression + digit;
      const live = computeLiveResult(newExpr);

      return {
        ...state,
        expression: newExpr,
        display: digit,
        liveResult: live,
        hasError: false,
        lastKind: 'number',
        justEvaluated: false,
      };
    }

    case 'OPERATOR': {
      const { operator } = action;
      let base = state.expression;

      // Start fresh from a result
      if (state.justEvaluated) {
        // Use the live result value as starting point
        const resultVal = tryEvaluate(base);
        base = resultVal !== null ? formatResult(resultVal).replace(/,/g, '') : base;
      }

      if (!base) {
        // Allow starting with minus (negative number)
        if (operator === '−') {
          return { ...state, expression: '-', display: '-', liveResult: '', lastKind: 'operator', justEvaluated: false };
        }
        return state;
      }

      // Replace last operator if we just typed one
      if (endsWithOperator(base)) {
        const newExpr = replaceLastOperator(base, operator);
        return {
          ...state,
          expression: newExpr,
          display: operator,
          liveResult: '',
          lastKind: 'operator',
          justEvaluated: false,
        };
      }

      // Remove trailing decimal before appending operator
      const cleanBase = endsWithDot(base) ? base.slice(0, -1) : base;
      const newExpr = cleanBase + operator;

      return {
        ...state,
        expression: newExpr,
        display: operator,
        liveResult: '',
        lastKind: 'operator',
        justEvaluated: false,
      };
    }

    case 'DECIMAL': {
      if (state.justEvaluated) {
        return {
          ...INITIAL,
          expression: '0.',
          display: '0.',
          liveResult: '',
          justEvaluated: false,
          lastKind: 'number',
        };
      }

      if (!canAddDecimal(state.expression)) return state;

      // If expression is empty or ends with operator, prepend 0
      const base =
        !state.expression || endsWithOperator(state.expression)
          ? state.expression + '0'
          : state.expression;

      const newExpr = base + '.';
      return {
        ...state,
        expression: newExpr,
        display: '.',
        liveResult: '',
        lastKind: 'number',
        justEvaluated: false,
      };
    }

    case 'NEGATE': {
      if (state.justEvaluated || !state.expression) {
        const newExpr = state.expression ? negateLastNumber(state.expression) : '-';
        return {
          ...state,
          expression: newExpr,
          display: newExpr,
          liveResult: computeLiveResult(newExpr),
          justEvaluated: false,
          lastKind: 'function',
        };
      }
      const negated = negateLastNumber(state.expression);
      return {
        ...state,
        expression: negated,
        liveResult: computeLiveResult(negated),
        lastKind: 'function',
      };
    }

    case 'PERCENT': {
      if (!state.expression || endsWithOperator(state.expression)) return state;
      if (state.justEvaluated) {
        const withPct = applyPercent(state.expression) + '%';
        const { value, error } = evaluate(withPct);
        const formatted = error ? 'Error' : formatResult(value);
        return {
          ...state,
          expression: withPct,
          display: formatted,
          liveResult: '',
          hasError: error,
          justEvaluated: true,
          lastKind: 'function',
        };
      }
      const pctExpr = applyPercent(state.expression);
      return {
        ...state,
        expression: pctExpr,
        liveResult: computeLiveResult(pctExpr),
        lastKind: 'function',
      };
    }

    case 'PAREN': {
      if (state.justEvaluated) {
        return { ...INITIAL, expression: '(', display: '(', lastKind: 'function', justEvaluated: false };
      }

      const paren = smartParen(state.expression);
      let newExpr = state.expression;

      if (paren === '(' && endsWithNumber(state.expression)) {
        // Implicit multiply: 5( → 5×(
        newExpr = state.expression + '×(';
      } else {
        newExpr = state.expression + paren;
      }

      return {
        ...state,
        expression: newExpr,
        display: paren,
        openParens: countOpenParens(newExpr),
        liveResult: computeLiveResult(newExpr),
        lastKind: 'function',
        justEvaluated: false,
      };
    }

    case 'EVALUATE': {
      // Close any open parens automatically
      let expr = state.expression;
      const open = countOpenParens(expr);
      for (let i = 0; i < open; i++) expr += ')';

      // Strip trailing operator
      if (endsWithOperator(expr)) expr = expr.slice(0, -1);
      if (endsWithDot(expr)) expr = expr.slice(0, -1);
      if (!expr) return state;

      const { value, error } = evaluate(expr);
      const formatted = error ? 'Error' : formatResult(value);

      return {
        ...state,
        expression: expr,
        display: formatted,
        liveResult: '',
        hasError: error,
        justEvaluated: true,
        openParens: 0,
        lastKind: 'equals',
      };
    }

    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  const handleButton = useCallback(
    (value: string, kind: ButtonKind) => {
      switch (value) {
        case 'clear':
          dispatch({ type: 'CLEAR' });
          break;
        case 'backspace':
          dispatch({ type: 'BACKSPACE' });
          break;
        case 'decimal':
          dispatch({ type: 'DECIMAL' });
          break;
        case 'negate':
          dispatch({ type: 'NEGATE' });
          break;
        case 'percent':
          dispatch({ type: 'PERCENT' });
          break;
        case 'paren':
          dispatch({ type: 'PAREN' });
          break;
        case 'equals':
          dispatch({ type: 'EVALUATE' });
          break;
        default:
          if (kind === 'operator') {
            dispatch({ type: 'OPERATOR', operator: value });
          } else if (kind === 'number') {
            dispatch({ type: 'DIGIT', digit: value });
          }
      }
    },
    []
  );

  const activeOperator = useMemo((): string | null => {
    if (!state.expression) return null;
    const last = lastChar(state.expression);
    if (['+', '−', '×', '÷'].includes(last)) return last;
    return null;
  }, [state.expression]);

  const displayExpression = useMemo((): string => {
    return state.expression;
  }, [state.expression]);

  return {
    state,
    handleButton,
    activeOperator,
    displayExpression,
  };
}
