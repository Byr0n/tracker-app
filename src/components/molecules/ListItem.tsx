import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { Avatar, AvatarSize, PresenceStatus } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  timestamp?: string;
  avatarName?: string;
  avatarUri?: string;
  avatarSize?: AvatarSize;
  presence?: PresenceStatus;
  leftIcon?: React.ReactNode;
  rightContent?: React.ReactNode;
  unreadCount?: number;
  isMuted?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ListItem({
  title,
  subtitle,
  timestamp,
  avatarName,
  avatarUri,
  avatarSize = 'md',
  presence = 'none',
  leftIcon,
  rightContent,
  unreadCount,
  isMuted = false,
  isSelected = false,
  onPress,
  style,
}: ListItemProps) {
  const { colors, space, textStyles, radii } = useTheme();

  const showAvatar = Boolean(avatarName ?? avatarUri);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[
        styles.row,
        {
          paddingHorizontal: space.md,
          paddingVertical: space.sm,
          backgroundColor: isSelected ? colors.surfaceSelected : 'transparent',
          borderRadius: isSelected ? radii.md : 0,
        },
        style,
      ]}
    >
      {/* Left: avatar or icon */}
      {showAvatar && (
        <View style={styles.avatarContainer}>
          <Avatar
            name={avatarName}
            uri={avatarUri}
            size={avatarSize}
            presence={presence}
          />
        </View>
      )}
      {!showAvatar && leftIcon && (
        <View style={[styles.iconContainer, { marginRight: space.sm }]}>
          {leftIcon}
        </View>
      )}

      {/* Center: title + subtitle */}
      <View style={styles.center}>
        <View style={styles.titleRow}>
          <Text
            style={[
              textStyles.bodyMD,
              {
                color: isSelected ? colors.textBrand : colors.textPrimary,
                fontWeight: unreadCount ? '600' : '400',
                flex: 1,
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {timestamp && (
            <Text
              style={[
                textStyles.captionSM,
                { color: unreadCount ? colors.textBrand : colors.textTertiary, marginLeft: space.sm },
              ]}
            >
              {timestamp}
            </Text>
          )}
        </View>

        {subtitle && (
          <Text
            style={[
              textStyles.bodySM,
              { color: isMuted ? colors.textTertiary : colors.textSecondary, marginTop: 2 },
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right: badge or custom content */}
      <View style={styles.right}>
        {rightContent
          ? rightContent
          : unreadCount
          ? <Badge count={unreadCount} variant="default" />
          : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  avatarContainer: {
    marginRight: 12,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    marginLeft: 8,
    alignItems: 'flex-end',
  },
});
