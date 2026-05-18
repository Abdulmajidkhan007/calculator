import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const GRID_PADDING = 16;
export const BUTTON_GAP = 11;
export const COLS = 4;

export const BUTTON_SIZE =
  (SCREEN_W - GRID_PADDING * 2 - BUTTON_GAP * (COLS - 1)) / COLS;

// Give the display ~38% of screen height on phones
export const DISPLAY_HEIGHT = SCREEN_H * 0.36;

export const SCREEN_WIDTH = SCREEN_W;
export const SCREEN_HEIGHT = SCREEN_H;

// Extra bottom padding on iOS for home indicator
export const GRID_BOTTOM_PADDING = Platform.OS === 'ios' ? 8 : 12;
