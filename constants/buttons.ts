import { ButtonConfig } from '../types/calculator';

export const BUTTON_ROWS: ButtonConfig[][] = [
  [
    { id: 'clear',  label: 'C',   kind: 'clear',    value: 'clear'  },
    { id: 'paren',  label: '( )', kind: 'function', value: 'paren'  },
    { id: 'pct',    label: '%',   kind: 'function', value: 'percent'},
    { id: 'div',    label: '÷',   kind: 'operator', value: '÷'      },
  ],
  [
    { id: 'seven',  label: '7',   kind: 'number',   value: '7' },
    { id: 'eight',  label: '8',   kind: 'number',   value: '8' },
    { id: 'nine',   label: '9',   kind: 'number',   value: '9' },
    { id: 'mul',    label: '×',   kind: 'operator', value: '×' },
  ],
  [
    { id: 'four',   label: '4',   kind: 'number',   value: '4' },
    { id: 'five',   label: '5',   kind: 'number',   value: '5' },
    { id: 'six',    label: '6',   kind: 'number',   value: '6' },
    { id: 'sub',    label: '−',   kind: 'operator', value: '−' },
  ],
  [
    { id: 'one',    label: '1',   kind: 'number',   value: '1' },
    { id: 'two',    label: '2',   kind: 'number',   value: '2' },
    { id: 'three',  label: '3',   kind: 'number',   value: '3' },
    { id: 'add',    label: '+',   kind: 'operator', value: '+' },
  ],
  [
    { id: 'negate', label: '+/−', kind: 'function', value: 'negate'  },
    { id: 'zero',   label: '0',   kind: 'number',   value: '0'       },
    { id: 'dot',    label: '.',   kind: 'number',   value: 'decimal' },
    { id: 'equals', label: '=',   kind: 'equals',   value: 'equals'  },
  ],
];

export const FLAT_BUTTONS: ButtonConfig[] = BUTTON_ROWS.flat();
