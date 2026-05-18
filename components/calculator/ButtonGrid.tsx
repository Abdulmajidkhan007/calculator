import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BUTTON_ROWS } from '../../constants/buttons';
import { ButtonKind } from '../../types/calculator';
import { Spacing } from '../../theme/spacing';
import CalcButton from './CalcButton';

interface ButtonGridProps {
  onPress: (value: string, kind: ButtonKind) => void;
  onHaptic: (kind: ButtonKind) => void;
  activeOperator: string | null;
}

function ButtonGrid({ onPress, onHaptic, activeOperator }: ButtonGridProps) {
  return (
    <View style={styles.grid}>
      {BUTTON_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((button) => (
            <CalcButton
              key={button.id}
              config={button}
              onPress={onPress}
              onHaptic={onHaptic}
              isActiveOperator={
                button.kind === 'operator' && button.value === activeOperator
              }
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: Spacing.gridPadding,
    gap: Spacing.buttonGap,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.buttonGap,
  },
});

export default memo(ButtonGrid);
