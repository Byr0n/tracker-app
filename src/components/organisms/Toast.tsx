import React, { useEffect, useRef, createContext, useContext, useState, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme';

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type ToastPosition = 'top' | 'bottom';

export interface ToastConfig {
  message: string;
  variant?: ToastVariant;
  position?: ToastPosition;
  duration?: number; // ms, 0 = persistent
  action?: { label: string; onPress: () => void };
}

interface ToastContextValue {
  show: (config: ToastConfig) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

interface ToastState extends ToastConfig {
  id: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function ToastItem({ toast, onHide }: { toast: ToastState; onHide: () => void }) {
  const { colors, radii, space, textStyles, shadows } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(toast.position === 'top' ? -20 : 20)).current;

  const bg = getToastBg(toast.variant ?? 'default', colors);
  const textColor = colors.textInverse;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
    ]).start();

    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(translateY, {
            toValue: toast.position === 'top' ? -20 : 20,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(onHide);
      }, toast.duration ?? 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: bg,
          borderRadius: radii.lg,
          paddingHorizontal: space.md,
          paddingVertical: space.sm,
          opacity,
          transform: [{ translateY }],
          maxWidth: SCREEN_WIDTH - 32,
        },
        shadows.lg,
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={[textStyles.bodyMD, { color: textColor, flex: 1 }]} numberOfLines={3}>
        {toast.message}
      </Text>
      {toast.action && (
        <TouchableOpacity onPress={toast.action.onPress} style={{ marginLeft: space.sm }}>
          <Text style={[textStyles.labelMD, { color: textColor, textDecorationLine: 'underline' }]}>
            {toast.action.label}
          </Text>
        </TouchableOpacity>
      )}
      {toast.duration === 0 && (
        <TouchableOpacity onPress={onHide} style={{ marginLeft: space.sm }}>
          <Text style={[textStyles.labelMD, { color: textColor }]}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

function getToastBg(
  variant: ToastVariant,
  colors: ReturnType<typeof useTheme>['colors'],
): string {
  switch (variant) {
    case 'success': return colors.statusOnline;
    case 'warning': return colors.statusAway;
    case 'danger': return colors.statusDnd;
    case 'info': return colors.textLink;
    default: return colors.bgInverse;
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const idRef = useRef(0);

  const show = useCallback((config: ToastConfig) => {
    setToast({ ...config, id: ++idRef.current });
  }, []);

  const hide = useCallback(() => setToast(null), []);

  const position = toast?.position ?? 'bottom';

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      {toast && (
        <View
          style={[
            styles.container,
            position === 'top' ? styles.top : styles.bottom,
          ]}
          pointerEvents="box-none"
        >
          <ToastItem toast={toast} onHide={hide} />
        </View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 9999,
  },
  top: {
    top: 56,
  },
  bottom: {
    bottom: 40,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
});
