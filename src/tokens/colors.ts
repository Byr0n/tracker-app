// Slack-inspired color palette
export const palette = {
  // Purple (Slack primary brand)
  purple50: '#F4F0FB',
  purple100: '#E8E0F7',
  purple200: '#C9B8EE',
  purple300: '#A98FE4',
  purple400: '#8A67DA',
  purple500: '#611F69', // Slack aubergine
  purple600: '#4A154B', // Slack dark aubergine
  purple700: '#3A1040',
  purple800: '#2A0B30',
  purple900: '#1A0720',

  // Green (presence / success)
  green50: '#F0FDF4',
  green100: '#DCFCE7',
  green200: '#BBF7D0',
  green300: '#86EFAC',
  green400: '#4ADE80',
  green500: '#2BAC76', // Slack active presence
  green600: '#007A5A', // Slack success
  green700: '#005C44',
  green800: '#003D2E',
  green900: '#001F17',

  // Red (destructive / error)
  red50: '#FFF0F0',
  red100: '#FFD6D6',
  red200: '#FFADAD',
  red300: '#FF8080',
  red400: '#FF5252',
  red500: '#E01E5A', // Slack red
  red600: '#CC0000',
  red700: '#990000',

  // Yellow (warning)
  yellow50: '#FFFBEB',
  yellow100: '#FEF3C7',
  yellow300: '#FCD34D',
  yellow500: '#F4C430',
  yellow600: '#D97706',

  // Blue (info / link)
  blue50: '#EFF6FF',
  blue100: '#DBEAFE',
  blue300: '#93C5FD',
  blue500: '#1264A3', // Slack blue
  blue600: '#0F52A0',
  blue700: '#0B3D7A',

  // Neutrals
  white: '#FFFFFF',
  gray50: '#F8F8F8',
  gray100: '#F1F1F1',
  gray200: '#E8E8E8',
  gray300: '#DDDDDD',
  gray400: '#C4C4C4',
  gray500: '#9E9E9E',
  gray600: '#717171',
  gray700: '#4A4A4A',
  gray800: '#2D2D2D',
  gray900: '#1A1A1A',
  black: '#000000',

  // Transparent
  transparent: 'transparent',
} as const;

export type PaletteColor = keyof typeof palette;

// Semantic color tokens — reference palette, don't hardcode
export const lightColors = {
  // Background
  bgPrimary: palette.white,
  bgSecondary: palette.gray50,
  bgTertiary: palette.gray100,
  bgInverse: palette.gray900,
  bgBrand: palette.purple600,
  bgBrandHover: palette.purple700,

  // Surface
  surfaceDefault: palette.white,
  surfaceRaised: palette.white,
  surfaceOverlay: palette.white,
  surfaceSelected: palette.purple50,
  surfaceHover: palette.gray50,

  // Text
  textPrimary: palette.gray900,
  textSecondary: palette.gray600,
  textTertiary: palette.gray500,
  textDisabled: palette.gray400,
  textInverse: palette.white,
  textBrand: palette.purple600,
  textLink: palette.blue500,
  textDanger: palette.red500,
  textSuccess: palette.green600,
  textWarning: palette.yellow600,

  // Border
  borderDefault: palette.gray200,
  borderSubtle: palette.gray100,
  borderStrong: palette.gray300,
  borderBrand: palette.purple600,
  borderDanger: palette.red500,
  borderFocus: palette.blue500,

  // Interactive
  interactivePrimary: palette.purple600,
  interactivePrimaryHover: palette.purple700,
  interactivePrimaryActive: palette.purple800,
  interactiveSecondary: palette.white,
  interactiveSecondaryHover: palette.gray50,
  interactiveDanger: palette.red500,
  interactiveDangerHover: palette.red600,
  interactiveDisabled: palette.gray300,

  // Status
  statusOnline: palette.green500,
  statusAway: palette.yellow500,
  statusDnd: palette.red500,
  statusOffline: palette.gray400,

  // Icon
  iconPrimary: palette.gray700,
  iconSecondary: palette.gray500,
  iconInverse: palette.white,
  iconBrand: palette.purple600,

  // Shadow
  shadowColor: palette.black,
} as const;

// Semantic type uses string values so dark/light can use different hex literals
export type SemanticColors = { [K in keyof typeof lightColors]: string };

export const darkColors: SemanticColors = {
  bgPrimary: palette.gray900,
  bgSecondary: palette.gray800,
  bgTertiary: palette.gray700,
  bgInverse: palette.white,
  bgBrand: palette.purple500,
  bgBrandHover: palette.purple400,

  surfaceDefault: palette.gray800,
  surfaceRaised: palette.gray700,
  surfaceOverlay: palette.gray800,
  surfaceSelected: palette.purple900,
  surfaceHover: palette.gray700,

  textPrimary: palette.white,
  textSecondary: palette.gray300,
  textTertiary: palette.gray400,
  textDisabled: palette.gray600,
  textInverse: palette.gray900,
  textBrand: palette.purple300,
  textLink: palette.blue300,
  textDanger: palette.red400,
  textSuccess: palette.green400,
  textWarning: palette.yellow300,

  borderDefault: palette.gray700,
  borderSubtle: palette.gray800,
  borderStrong: palette.gray600,
  borderBrand: palette.purple400,
  borderDanger: palette.red400,
  borderFocus: palette.blue300,

  interactivePrimary: palette.purple500,
  interactivePrimaryHover: palette.purple400,
  interactivePrimaryActive: palette.purple300,
  interactiveSecondary: palette.gray700,
  interactiveSecondaryHover: palette.gray600,
  interactiveDanger: palette.red500,
  interactiveDangerHover: palette.red400,
  interactiveDisabled: palette.gray700,

  statusOnline: palette.green500,
  statusAway: palette.yellow500,
  statusDnd: palette.red500,
  statusOffline: palette.gray600,

  iconPrimary: palette.gray200,
  iconSecondary: palette.gray400,
  iconInverse: palette.gray900,
  iconBrand: palette.purple300,

  shadowColor: palette.black,
} as const;

