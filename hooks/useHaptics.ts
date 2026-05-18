import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { ButtonKind } from '../types/calculator';

export function useHaptics() {
  const trigger = useCallback((kind: ButtonKind) => {
    switch (kind) {
      case 'equals':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'clear':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'operator':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'backspace':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }
  }, []);

  return { trigger };
}
