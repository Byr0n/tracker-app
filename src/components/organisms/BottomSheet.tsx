import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapHeight?: number | string; // px or '50%'
  style?: StyleProp<ViewStyle>;
}

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  snapHeight = '50%',
  style,
}: BottomSheetProps) {
  const { colors, radii, space, textStyles, shadows } = useTheme();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const resolvedHeight =
    typeof snapHeight === 'string' && snapHeight.endsWith('%')
      ? SCREEN_HEIGHT * (parseFloat(snapHeight) / 100)
      : Number(snapHeight);

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        damping: 22,
        stiffness: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          {
            height: resolvedHeight,
            backgroundColor: colors.surfaceOverlay,
            borderTopLeftRadius: radii['2xl'],
            borderTopRightRadius: radii['2xl'],
            transform: [{ translateY }],
          },
          shadows['2xl'],
          style,
        ]}
      >
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />

        {/* Header */}
        {title && (
          <View
            style={[
              styles.header,
              {
                paddingHorizontal: space.md,
                paddingVertical: space.sm,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.borderDefault,
              },
            ]}
          >
            <Text style={[textStyles.headingSM, { color: colors.textPrimary }]}>
              {title}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
              accessibilityLabel="Close"
            >
              <Text style={[textStyles.bodyMD, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content */}
        <View style={[styles.content, { padding: space.md }]}>{children}</View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
});
