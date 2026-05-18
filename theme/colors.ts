export const Colors = {
  bg: {
    primary: '#06080D',
    secondary: '#0B0F17',
    surface0: '#0E131C',
    surface1: '#111820',
    surface2: '#171F2C',
    surface3: '#1C2535',
  },

  button: {
    number: '#10181F',
    numberBorder: 'rgba(255,255,255,0.055)',
    numberShadow: 'rgba(0,0,0,0.6)',

    operator: '#130F24',
    operatorBorder: 'rgba(123,97,255,0.22)',
    operatorShadow: 'rgba(123,97,255,0.1)',
    operatorActive: '#1E1840',

    fn: '#0D1320',
    fnBorder: 'rgba(255,255,255,0.05)',

    equalsStart: '#00D4B8',
    equalsEnd: '#0070E0',
    equalsShadow: 'rgba(0,212,184,0.45)',
    equalsBorder: 'rgba(0,212,184,0.4)',

    clear: '#180E14',
    clearBorder: 'rgba(255,59,92,0.22)',
    clearShadow: 'rgba(255,59,92,0.15)',
  },

  text: {
    primary: '#EEF2FF',
    secondary: '#6B7A90',
    tertiary: '#353F52',
    operator: '#A78BFA',
    operatorActive: '#C4AFFE',
    fn: '#5A6A80',
    clear: '#FF6B81',
    equals: '#FFFFFF',
    expression: '#4A5568',
    livePreview: '#2E3A4E',
  },

  accent: {
    cyan: '#00D4B8',
    purple: '#7B61FF',
    red: '#FF3B5C',
    blue: '#0070E0',
    glow: 'rgba(0,212,184,0.6)',
  },

  display: {
    bg: 'rgba(255,255,255,0.018)',
    border: 'rgba(255,255,255,0.055)',
    highlight: 'rgba(255,255,255,0.025)',
  },
} as const;

export type ColorsType = typeof Colors;
