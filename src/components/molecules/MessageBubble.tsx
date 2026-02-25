import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Avatar } from '../atoms/Avatar';

export type MessageBubbleVariant = 'sent' | 'received';

export interface MessageBubbleProps {
  message: string;
  senderName?: string;
  senderAvatarUri?: string;
  timestamp?: string;
  variant?: MessageBubbleVariant;
  showAvatar?: boolean;
  showSenderName?: boolean;
  isEdited?: boolean;
  reactions?: Array<{ emoji: string; count: number }>;
  style?: StyleProp<ViewStyle>;
}

export function MessageBubble({
  message,
  senderName = 'User',
  senderAvatarUri,
  timestamp,
  variant = 'received',
  showAvatar = true,
  showSenderName = true,
  isEdited = false,
  reactions,
  style,
}: MessageBubbleProps) {
  const { colors, radii, space, textStyles } = useTheme();
  const isSent = variant === 'sent';

  const bubbleBg = isSent ? colors.interactivePrimary : colors.bgSecondary;
  const bubbleTextColor = isSent ? colors.textInverse : colors.textPrimary;

  return (
    <View
      style={[
        styles.container,
        { flexDirection: isSent ? 'row-reverse' : 'row' },
        style,
      ]}
    >
      {/* Avatar — only for received messages */}
      {!isSent && showAvatar && (
        <View style={styles.avatarWrapper}>
          <Avatar name={senderName} uri={senderAvatarUri} size="sm" />
        </View>
      )}

      <View style={[styles.content, isSent ? styles.contentSent : styles.contentReceived]}>
        {/* Sender name */}
        {!isSent && showSenderName && (
          <Text
            style={[
              textStyles.labelSM,
              { color: colors.textBrand, marginBottom: 2 },
            ]}
          >
            {senderName}
          </Text>
        )}

        {/* Bubble */}
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: bubbleBg,
              borderRadius: radii.xl,
              paddingHorizontal: space.md,
              paddingVertical: space.sm,
              // Flatten corner toward avatar
              borderBottomLeftRadius: !isSent ? radii.xs : radii.xl,
              borderBottomRightRadius: isSent ? radii.xs : radii.xl,
            },
          ]}
        >
          <Text style={[textStyles.bodyMD, { color: bubbleTextColor }]}>{message}</Text>
        </View>

        {/* Reactions */}
        {reactions && reactions.length > 0 && (
          <View style={[styles.reactions, { marginTop: space.xs }]}>
            {reactions.map((r, i) => (
              <View
                key={i}
                style={[
                  styles.reactionPill,
                  {
                    backgroundColor: colors.bgSecondary,
                    borderRadius: radii.full,
                    borderWidth: 1,
                    borderColor: colors.borderDefault,
                    paddingHorizontal: space.sm,
                    paddingVertical: 2,
                    marginRight: space.xs,
                  },
                ]}
              >
                <Text style={textStyles.captionSM}>
                  {r.emoji} {r.count}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Timestamp + edited */}
        <View style={[styles.meta, isSent ? styles.metaSent : styles.metaReceived]}>
          {isEdited && (
            <Text style={[textStyles.captionSM, { color: colors.textTertiary, marginRight: 4 }]}>
              (edited)
            </Text>
          )}
          {timestamp && (
            <Text style={[textStyles.captionSM, { color: colors.textTertiary }]}>
              {timestamp}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    marginVertical: 4,
  },
  avatarWrapper: {
    marginRight: 8,
    marginBottom: 4,
  },
  content: {
    maxWidth: '75%',
  },
  contentReceived: {
    alignItems: 'flex-start',
  },
  contentSent: {
    alignItems: 'flex-end',
  },
  bubble: {
    flexShrink: 1,
  },
  reactions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    flexDirection: 'row',
    marginTop: 2,
  },
  metaReceived: {
    justifyContent: 'flex-start',
  },
  metaSent: {
    justifyContent: 'flex-end',
  },
});
