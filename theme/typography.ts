import { Platform } from 'react-native';

const FONT_FAMILY = Platform.select({
  ios: 'SF Pro Display',
  android: 'sans-serif-light',
  default: 'System',
});

const FONT_FAMILY_MONO = Platform.select({
  ios: 'SF Mono',
  android: 'monospace',
  default: 'monospace',
});

export const Typography = {
  fontFamily: FONT_FAMILY,
  fontFamilyMono: FONT_FAMILY_MONO,

  displayXL: {
    fontSize: 76,
    fontWeight: '200' as const,
    letterSpacing: -3,
    lineHeight: 82,
  },
  displayL: {
    fontSize: 58,
    fontWeight: '200' as const,
    letterSpacing: -2,
    lineHeight: 64,
  },
  displayM: {
    fontSize: 44,
    fontWeight: '300' as const,
    letterSpacing: -1.5,
    lineHeight: 50,
  },
  displayS: {
    fontSize: 32,
    fontWeight: '300' as const,
    letterSpacing: -1,
    lineHeight: 38,
  },

  expression: {
    fontSize: 20,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  livePreview: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 22,
  },

  buttonNumber: {
    fontSize: 26,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  buttonOperator: {
    fontSize: 26,
    fontWeight: '300' as const,
    letterSpacing: 0,
  },
  buttonFn: {
    fontSize: 20,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  buttonEquals: {
    fontSize: 30,
    fontWeight: '300' as const,
    letterSpacing: 0,
  },
} as const;
