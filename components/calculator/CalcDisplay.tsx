import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { DISPLAY_HEIGHT } from '../../constants/layout';
import { getDisplayFontSize, getExpressionFontSize } from '../../utils/numberFormat';

interface CalcDisplayProps {
  expression: string;
  display: string;
  liveResult: string;
  hasError: boolean;
  justEvaluated: boolean;
}

export default function CalcDisplay({
  expression,
  display,
  liveResult,
  hasError,
  justEvaluated,
}: CalcDisplayProps) {
  const scrollRef = useRef<ScrollView>(null);

  const resultScale = useSharedValue(1);
  const resultOpacity = useSharedValue(1);
  const resultTranslateY = useSharedValue(0);
  const previewOpacity = useSharedValue(0);

  const prevDisplay = useRef(display);

  useEffect(() => {
    if (display !== prevDisplay.current) {
      if (justEvaluated) {
        resultScale.value = withSequence(
          withTiming(0.94, { duration: 60, easing: Easing.out(Easing.quad) }),
          withSpring(1, { damping: 10, stiffness: 300 })
        );
        resultOpacity.value = withSequence(
          withTiming(0.5, { duration: 60 }),
          withTiming(1, { duration: 120 })
        );
        resultTranslateY.value = withSequence(
          withTiming(6, { duration: 60 }),
          withSpring(0, { damping: 12, stiffness: 400 })
        );
      } else {
        resultOpacity.value = withSequence(
          withTiming(0.7, { duration: 40 }),
          withTiming(1, { duration: 80 })
        );
      }
      prevDisplay.current = display;
    }
  }, [display, justEvaluated, resultScale, resultOpacity, resultTranslateY]);

  useEffect(() => {
    if (liveResult) {
      previewOpacity.value = withTiming(1, { duration: 200 });
    } else {
      previewOpacity.value = withTiming(0, { duration: 120 });
    }
  }, [liveResult, previewOpacity]);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }, [expression]);

  const resultAnimStyle = useAnimatedStyle(() => ({
    opacity: resultOpacity.value,
    transform: [
      { scale: resultScale.value },
      { translateY: resultTranslateY.value },
    ],
  }));

  const previewAnimStyle = useAnimatedStyle(() => ({
    opacity: previewOpacity.value,
  }));

  const displayFontSize = getDisplayFontSize(display, 76);
  const exprFontSize = getExpressionFontSize(expression, 20);

  const displayColor = hasError ? Colors.accent.red : Colors.text.primary;

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#0A0E18', '#070B12']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.glassPanel}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidGlass]} />
        )}

        <LinearGradient
          colors={['transparent', Colors.accent.cyan, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.accentLine}
        />

        <View style={styles.displayContent}>
          <View style={styles.expressionRow}>
            <ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.expressionScroll}
            >
              <Text
                style={[
                  styles.expressionText,
                  { fontSize: exprFontSize },
                  justEvaluated && styles.expressionFaded,
                ]}
                numberOfLines={1}
              >
                {expression || ''}
              </Text>
            </ScrollView>
          </View>

          <Animated.View style={[styles.livePreviewRow, previewAnimStyle]}>
            <Text style={styles.livePreviewText} numberOfLines={1}>
              = {liveResult}
            </Text>
          </Animated.View>

          <Animated.View style={[styles.resultRow, resultAnimStyle]}>
            <Text
              style={[
                styles.resultText,
                { fontSize: displayFontSize, color: displayColor },
                hasError && styles.errorText,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.4}
            >
              {display === '' ? '0' : display}
            </Text>
          </Animated.View>
        </View>
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,212,184,0.12)', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.bottomGlow}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: DISPLAY_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },

  glassPanel: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 0,
    borderRadius: Spacing.borderRadius.panel,
    borderWidth: 1,
    borderColor: Colors.display.border,
    overflow: 'hidden',
    backgroundColor: Colors.display.bg,
  },

  androidGlass: {
    backgroundColor: 'rgba(10,14,24,0.85)',
  },

  accentLine: {
    height: 1,
    width: '100%',
    opacity: 0.6,
  },

  displayContent: {
    flex: 1,
    paddingHorizontal: Spacing.displayPadding,
    paddingTop: 18,
    paddingBottom: Spacing.displayPaddingBottom,
    justifyContent: 'flex-end',
    gap: 4,
  },

  expressionRow: {
    height: 34,
    justifyContent: 'center',
  },

  expressionScroll: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },

  expressionText: {
    ...Typography.expression,
    color: Colors.text.expression,
    fontFamily: Typography.fontFamily ?? undefined,
    textAlign: 'right',
  },

  expressionFaded: {
    color: Colors.text.tertiary,
  },

  livePreviewRow: {
    height: 22,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 2,
  },

  livePreviewText: {
    ...Typography.livePreview,
    color: Colors.text.livePreview,
    fontFamily: Typography.fontFamily ?? undefined,
  },

  resultRow: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: 4,
    minHeight: 82,
  },

  resultText: {
    ...Typography.displayXL,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily ?? undefined,
    textAlign: 'right',
    includeFontPadding: false,
  },

  errorText: {
    color: Colors.accent.red,
    fontSize: 42,
  },

  bottomGlow: {
    height: 1,
    marginHorizontal: 16,
  },
});
