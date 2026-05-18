export type ButtonKind =
  | 'number'
  | 'operator'
  | 'function'
  | 'equals'
  | 'clear'
  | 'backspace';

export interface ButtonConfig {
  id: string;
  label: string;
  kind: ButtonKind;
  value: string;
  flex?: number;
  icon?: string;
}

export interface CalculatorState {
  expression: string;
  display: string;
  liveResult: string;
  hasError: boolean;
  justEvaluated: boolean;
  openParens: number;
  lastKind: ButtonKind | null;
}

export type CalcAction =
  | { type: 'DIGIT'; digit: string }
  | { type: 'OPERATOR'; operator: string }
  | { type: 'DECIMAL' }
  | { type: 'NEGATE' }
  | { type: 'PERCENT' }
  | { type: 'PAREN' }
  | { type: 'BACKSPACE' }
  | { type: 'CLEAR' }
  | { type: 'EVALUATE' };

export interface EvalResult {
  value: number;
  formatted: string;
  hasError: boolean;
}
