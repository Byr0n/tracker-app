import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type PresenceStatus = 'online' | 'away' | 'dnd' | 'offline' | 'none';

export interface AvatarProps {
  name?: string;
  uri?: string;
  size?: AvatarSize;
  presence?: PresenceStatus;
  style?: StyleProp<ViewStyle>;
}

const SIZES: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const PRESENCE_SIZE: Record<AvatarSize, number> = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Deterministic color from name
const AVATAR_COLORS = [
  '#611F69', '#1264A3', '#007A5A', '#E01E5A',
  '#D97706', '#0891B2', '#7C3AED', '#0F766E',
];
function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function Avatar({
  name = 'User',
  uri,
  size = 'md',
  presence = 'none',
  style,
}: AvatarProps) {
  const { colors, radii } = useTheme();
  const dim = SIZES[size];
  const presenceDim = PRESENCE_SIZE[size];
  const fontSize = dim * 0.38;
  const avatarBg = getAvatarColor(name);

  const presenceColor = getPresenceColor(presence, colors);

  return (
    <View style={[{ width: dim, height: dim }, style]}>
      <View
        style={[
          styles.avatar,
          {
            width: dim,
            height: dim,
            borderRadius: radii.md,
            backgroundColor: uri ? colors.bgSecondary : avatarBg,
          },
        ]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={[styles.image, { width: dim, height: dim, borderRadius: radii.md }]}
            accessibilityLabel={name}
          />
        ) : (
          <Text style={[styles.initials, { fontSize, color: '#FFFFFF' }]}>
            {getInitials(name)}
          </Text>
        )}
      </View>

      {presence !== 'none' && (
        <View
          style={[
            styles.presenceDot,
            {
              width: presenceDim,
              height: presenceDim,
              borderRadius: presenceDim / 2,
              backgroundColor: presenceColor,
              borderWidth: 2,
              borderColor: colors.bgPrimary,
              bottom: -1,
              right: -1,
            },
          ]}
          accessibilityLabel={`Status: ${presence}`}
        />
      )}
    </View>
  );
}

function getPresenceColor(
  presence: PresenceStatus,
  colors: ReturnType<typeof useTheme>['colors'],
): string {
  switch (presence) {
    case 'online': return colors.statusOnline;
    case 'away': return colors.statusAway;
    case 'dnd': return colors.statusDnd;
    default: return colors.statusOffline;
  }
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    fontWeight: '600',
  },
  presenceDot: {
    position: 'absolute',
  },
});
