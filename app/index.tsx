import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';

import { useCalculator } from '../hooks/useCalculator';
import { useHaptics } from '../hooks/useHaptics';
import { ButtonKind } from '../types/calculator';
import { Colors } from '../theme/colors';
import { GRID_BOTTOM_PADDING } from '../constants/layout';

import CalcDisplay from '../components/calculator/CalcDisplay';
import ButtonGrid from '../components/calculator/ButtonGrid';
import BackspaceButton from '../components/calculator/BackspaceButton';

export default function CalculatorScreen() {
  const { state, handleButton, activeOperator, displayExpression } = useCalculator();
  const { trigger } = useHaptics();

  const handlePress = useCallback(
    (value: string, kind: ButtonKind) => {
      handleButton(value, kind);
    },
    [handleButton]
  );

  const handleHaptic = useCallback(
    (kind: ButtonKind) => {
      trigger(kind);
    },
    [trigger]
  );

  const handleBackspace = useCallback(() => {
    handleButton('backspace', 'backspace');
  }, [handleButton]);

  return (
    <View style={styles.root}>
      {/* Background gradient */}
      <LinearGradient
        colors={[Colors.bg.primary, Colors.bg.secondary, '#070C16']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Subtle radial glow at top-right */}
      <View style={styles.topGlow} pointerEvents="none" />
      {/* Subtle radial glow at bottom-left */}
      <View style={styles.bottomGlow} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header: app name + backspace */}
        <Animated.View
          entering={FadeIn.delay(100).duration(400)}
          style={styles.header}
        >
          <View style={styles.headerDot}>
            <LinearGradient
              colors={[Colors.accent.cyan, Colors.accent.blue]}
              style={styles.dot}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </View>
          <BackspaceButton onPress={handleBackspace} />
        </Animated.View>

        {/* Display */}
        <Animated.View
          entering={FadeIn.delay(150).duration(400)}
          style={styles.displayWrapper}
        >
          <CalcDisplay
            expression={displayExpression}
            display={state.display}
            liveResult={state.liveResult}
            hasError={state.hasError}
            justEvaluated={state.justEvaluated}
          />
        </Animated.View>

        {/* Spacer between display and grid */}
        <View style={styles.spacer} />

        {/* Button Grid */}
        <Animated.View
          entering={SlideInDown.delay(200).duration(500).springify().damping(20)}
          style={[styles.gridWrapper, { paddingBottom: GRID_BOTTOM_PADDING }]}
        >
          <ButtonGrid
            onPress={handlePress}
            onHaptic={handleHaptic}
            activeOperator={activeOperator}
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },

  topGlow: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(123,97,255,0.055)',
  },

  bottomGlow: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(0,212,184,0.04)',
  },

  safeArea: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 8 : 4,
    paddingBottom: 12,
  },

  headerDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  displayWrapper: {
    flexShrink: 0,
  },

  spacer: {
    flex: 1,
    minHeight: 12,
    maxHeight: 32,
  },

  gridWrapper: {
    flexShrink: 0,
  },
});
