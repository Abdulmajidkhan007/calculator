import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ButtonConfig, ButtonKind } from '../../types/calculator';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { BUTTON_SIZE } from '../../constants/layout';

interface CalcButtonProps {
  config: ButtonConfig;
  onPress: (value: string, kind: ButtonKind) => void;
  onHaptic: (kind: ButtonKind) => void;
  isActiveOperator?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function CalcButton({ config, onPress, onHaptic, isActiveOperator = false }: CalcButtonProps) {
  const { label, value, kind } = config;

  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const animatedContainer = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedGlow = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(0.875, { damping: 18, stiffness: 500, mass: 0.6 });
    glow.value = withTiming(1, { duration: 80 });
  }, []);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, { damping: 14, stiffness: 280, mass: 0.7 });
    glow.value = withTiming(0, { duration: 200 });
  }, []);

  const handlePress = useCallback(() => {
    runOnJS(onHaptic)(kind);
    runOnJS(onPress)(value, kind);
  }, [onPress, onHaptic, value, kind]);

  const renderContent = () => {
    if (kind === 'equals') {
      return (
        <LinearGradient
          colors={[Colors.button.equalsStart, Colors.button.equalsEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.equalsGradient}
        >
          <Animated.View style={[styles.equalsGlow, animatedGlow]} />
          <Text style={[styles.buttonText, styles.equalsText]}>{label}</Text>
        </LinearGradient>
      );
    }

    if (kind === 'operator') {
      return (
        <View style={[
          styles.buttonInner,
          styles.operatorInner,
          isActiveOperator && styles.operatorActive,
        ]}>
          <Animated.View
            style={[
              styles.operatorGlow,
              animatedGlow,
              isActiveOperator && styles.operatorGlowActive,
            ]}
          />
          <Text style={[
            styles.buttonText,
            styles.operatorText,
            isActiveOperator && styles.operatorTextActive,
          ]}>
            {label}
          </Text>
        </View>
      );
    }

    if (kind === 'clear') {
      return (
        <View style={[styles.buttonInner, styles.clearInner]}>
          <Animated.View style={[styles.clearGlow, animatedGlow]} />
          <Text style={[styles.buttonText, styles.clearText]}>{label}</Text>
        </View>
      );
    }

    if (kind === 'function') {
      return (
        <View style={[styles.buttonInner, styles.fnInner]}>
          <Text style={[styles.buttonText, styles.fnText]}>{label}</Text>
        </View>
      );
    }

    // Number
    return (
      <View style={[styles.buttonInner, styles.numberInner]}>
        <Text style={styles.buttonText}>{label}</Text>
      </View>
    );
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[styles.container, animatedContainer]}
      hitSlop={4}
    >
      {renderContent()}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },

  buttonInner: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  numberInner: {
    backgroundColor: Colors.button.number,
    borderWidth: 1,
    borderColor: Colors.button.numberBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.button.numberShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },

  operatorInner: {
    backgroundColor: Colors.button.operator,
    borderWidth: 1,
    borderColor: Colors.button.operatorBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.button.operatorShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
      },
      android: { elevation: 5 },
    }),
  },

  operatorActive: {
    backgroundColor: Colors.button.operatorActive,
    borderColor: 'rgba(167,139,250,0.45)',
  },

  operatorGlow: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(123,97,255,0.25)',
    opacity: 0,
  },

  operatorGlowActive: {
    opacity: 0.5,
  },

  clearInner: {
    backgroundColor: Colors.button.clear,
    borderWidth: 1,
    borderColor: Colors.button.clearBorder,
  },

  clearGlow: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(255,59,92,0.3)',
    opacity: 0,
  },

  fnInner: {
    backgroundColor: Colors.button.fn,
    borderWidth: 1,
    borderColor: Colors.button.fnBorder,
  },

  equalsGradient: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.button.equalsShadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: { elevation: 10 },
    }),
  },

  equalsGlow: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(0,212,184,0.4)',
    opacity: 0,
  },

  buttonText: {
    ...Typography.buttonNumber,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily ?? undefined,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  operatorText: {
    ...Typography.buttonOperator,
    color: Colors.text.operator,
  },

  operatorTextActive: {
    color: Colors.text.operatorActive,
  },

  clearText: {
    ...Typography.buttonFn,
    color: Colors.text.clear,
  },

  fnText: {
    ...Typography.buttonFn,
    color: Colors.text.fn,
    fontSize: 18,
  },

  equalsText: {
    ...Typography.buttonEquals,
    color: Colors.text.equals,
    fontWeight: '300',
  },
});

export default memo(CalcButton);
