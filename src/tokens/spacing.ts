// 4pt grid spacing system
export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
} as const;

export type SpacingKey = keyof typeof spacing;
export type SpacingValue = typeof spacing[SpacingKey];

// Named semantic spacing aliases
export const space = {
  none: spacing[0],
  xxs: spacing[0.5],   // 2
  xs: spacing[1],      // 4
  sm: spacing[2],      // 8
  md: spacing[4],      // 16
  lg: spacing[6],      // 24
  xl: spacing[8],      // 32
  '2xl': spacing[10],  // 40
  '3xl': spacing[12],  // 48
  '4xl': spacing[16],  // 64
  '5xl': spacing[20],  // 80
} as const;

// Border radii
export const radii = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
} as const;

export type RadiusKey = keyof typeof radii;

// Icon sizes
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
} as const;

// Hit slop — minimum 44pt touch target
export const hitSlop = {
  xs: { top: 8, right: 8, bottom: 8, left: 8 },
  sm: { top: 12, right: 12, bottom: 12, left: 12 },
  md: { top: 16, right: 16, bottom: 16, left: 16 },
} as const;
