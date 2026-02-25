import { Platform } from 'react-native';

// Cross-platform shadow factory
const makeShadow = (
  elevation: number,
  color: string,
  offsetY: number,
  blur: number,
  opacity: number,
) =>
  Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: blur,
    },
    android: { elevation },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: blur,
    },
  });

export const shadows = {
  none: makeShadow(0, '#000', 0, 0, 0),
  xs: makeShadow(1, '#000', 1, 2, 0.08),
  sm: makeShadow(2, '#000', 1, 4, 0.1),
  md: makeShadow(4, '#000', 2, 8, 0.12),
  lg: makeShadow(8, '#000', 4, 16, 0.14),
  xl: makeShadow(16, '#000', 8, 24, 0.16),
  '2xl': makeShadow(24, '#000', 12, 32, 0.2),
} as const;

export type ShadowKey = keyof typeof shadows;
