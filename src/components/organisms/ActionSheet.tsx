import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export interface ActionSheetAction {
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actions: ActionSheetAction[];
  showCancel?: boolean;
  cancelLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function ActionSheet({
  visible,
  onClose,
  title,
  message,
  actions,
  showCancel = true,
  cancelLabel = 'Cancel',
  style,
}: ActionSheetProps) {
  const { colors, radii, space, textStyles, shadows } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={[styles.container, { padding: space.md }]}>
        {/* Main sheet */}
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surfaceOverlay,
              borderRadius: radii.xl,
              overflow: 'hidden',
            },
            shadows.xl,
            style,
          ]}
        >
          {/* Header */}
          {(title || message) && (
            <View
              style={[
                styles.headerSection,
                {
                  paddingHorizontal: space.md,
                  paddingVertical: space.sm,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.borderDefault,
                },
              ]}
            >
              {title && (
                <Text
                  style={[textStyles.labelMD, { color: colors.textSecondary, textAlign: 'center' }]}
                >
                  {title}
                </Text>
              )}
              {message && (
                <Text
                  style={[
                    textStyles.captionMD,
                    { color: colors.textTertiary, textAlign: 'center', marginTop: 2 },
                  ]}
                >
                  {message}
                </Text>
              )}
            </View>
          )}

          {/* Actions */}
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (!action.disabled) {
                  action.onPress();
                  onClose();
                }
              }}
              disabled={action.disabled}
              style={[
                styles.actionRow,
                {
                  paddingHorizontal: space.md,
                  paddingVertical: space.md,
                  opacity: action.disabled ? 0.4 : 1,
                  borderTopWidth: index === 0 && !(title || message) ? 0 : StyleSheet.hairlineWidth,
                  borderTopColor: colors.borderDefault,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              {action.icon && <View style={{ marginRight: space.sm }}>{action.icon}</View>}
              <Text
                style={[
                  textStyles.bodyLG,
                  {
                    color: action.destructive ? colors.textDanger : colors.textPrimary,
                    flex: 1,
                    textAlign: 'center',
                  },
                ]}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cancel button (separate pill — iOS style) */}
        {showCancel && (
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.cancelButton,
              {
                backgroundColor: colors.surfaceOverlay,
                borderRadius: radii.xl,
                paddingVertical: space.md,
                marginTop: space.sm,
              },
              shadows.md,
            ]}
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
          >
            <Text style={[textStyles.bodyLG, { color: colors.textBrand, textAlign: 'center', fontWeight: '600' }]}>
              {cancelLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    alignSelf: 'stretch',
  },
  headerSection: {
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {
    alignSelf: 'stretch',
  },
});
