import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: string;
  placement?: TooltipPlacement;
  children: React.ReactElement;
  style?: StyleProp<ViewStyle>;
}

export function Tooltip({
  content,
  placement = 'top',
  children,
  style,
}: TooltipProps) {
  const { colors, radii, space, textStyles, shadows } = useTheme();
  const [visible, setVisible] = useState(false);
  const [layout, setLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const triggerRef = useRef<View>(null);

  const show = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setLayout({ x, y, width, height });
      setVisible(true);
    });
  };

  const hide = () => setVisible(false);

  const tooltipPosition = layout ? getTooltipPosition(placement, layout) : { top: 0, left: 0 };

  return (
    <>
      <View ref={triggerRef} onStartShouldSetResponder={() => { show(); return false; }}>
        {React.cloneElement(children as React.ReactElement<{ onPress?: () => void }>, { onPress: show })}
      </View>

      <Modal visible={visible} transparent animationType="none" onRequestClose={hide}>
        <TouchableWithoutFeedback onPress={hide}>
          <View style={StyleSheet.absoluteFill}>
            <View
              style={[
                styles.tooltip,
                {
                  ...tooltipPosition,
                  backgroundColor: colors.bgInverse,
                  borderRadius: radii.md,
                  padding: space.sm,
                  maxWidth: 200,
                },
                shadows.md,
                style,
              ]}
            >
              <Text style={[textStyles.captionMD, { color: colors.textInverse }]}>
                {content}
              </Text>
              {/* Arrow */}
              <View style={[styles.arrow, getArrowStyle(placement, colors.bgInverse)]} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

function getTooltipPosition(
  placement: TooltipPlacement,
  layout: { x: number; y: number; width: number; height: number },
) {
  const GAP = 8;
  switch (placement) {
    case 'bottom':
      return { top: layout.y + layout.height + GAP, left: layout.x };
    case 'left':
      return { top: layout.y, left: layout.x - 200 - GAP };
    case 'right':
      return { top: layout.y, left: layout.x + layout.width + GAP };
    default: // top
      return { top: layout.y - GAP - 36, left: layout.x };
  }
}

function getArrowStyle(placement: TooltipPlacement, color: string) {
  const size = 6;
  const base: Record<string, number | string> = {
    position: 'absolute',
    width: 0,
    height: 0,
  };
  switch (placement) {
    case 'top':
      return {
        ...base,
        bottom: -size,
        left: 12,
        borderLeftWidth: size,
        borderRightWidth: size,
        borderTopWidth: size,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: color,
      };
    case 'bottom':
      return {
        ...base,
        top: -size,
        left: 12,
        borderLeftWidth: size,
        borderRightWidth: size,
        borderBottomWidth: size,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      };
    default:
      return base;
  }
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    zIndex: 9999,
  },
  arrow: {},
});
